# Configuration et capacités du processus

## Charger une configuration typée

`DSCommon.environmentVariable` reçoit une shape de data structures et retourne un résultat asynchrone : `decode-success` avec les valeurs typées, `decode-error` pour une configuration non conforme, ou une erreur de lecture d'un fichier d'environnement. Les strings du runtime sont décodées selon les structures ; ne pas les convertir avec des casts dans le code consommateur.

`environmentVariableOrThrow` appelle la version sûre, puis fournit les valeurs validées ou lève `EnvironmentVariableError` si le chargement ou le décodage échoue. Au démarrage, cet usage exprime la décision du point d'entrée d'interrompre une initialisation invalide, comme dans l'exemple ; il ne requalifie pas un refus de validation en défaillance imprévue. Dans une fonction qui doit transmettre son échec, conserver le résultat d'`environmentVariable`.

Choisir les options qui déterminent les effets du chargement :

- `includedEnvironmentFiles` ajoute les fichiers aux variables déjà présentes. Une erreur de lecture d'un fichier indiqué est propagée ; ne pas considérer implicitement ces fichiers comme facultatifs.
- `override: false` (défaut) donne la priorité aux sources précédentes, dont les variables du runtime ; `true` donne priorité aux suivantes. L'ordre des fichiers participe à cette priorité.
- `justRead: true` renvoie les valeurs validées sans modifier les variables du processus. Par défaut, un chargement réussi répercute les valeurs sur l'environnement du runtime.
- `codecs` choisit le décodage. Fournir explicitement `DSDataStructure.codecsString` pour des structures serveur telles que `file` ou `folder`, afin de ne pas dépendre des codecs par défaut de l'implémentation du runtime.

Voir [configuration et chemins du module](examples/environment.ts). Pour les substitutions de variables et des exemples complémentaires, rechercher les variables d'environnement dans le routeur conceptuel du package installé.

## Choisir l'origine d'un chemin

`getCurrentWorkDirectory()` retourne un `Success` portant le chemin absolu du dossier de travail, ou un `Error`. Il dépend de l'endroit où le processus a été lancé et peut changer pendant l'exécution. Sa variante `getCurrentWorkDirectoryOrThrow()` fournit directement le chemin ou lève une erreur.

`getCurrentDirectoryName(import.meta)` donne le chemin absolu du dossier du module dont on fournit les métadonnées. L'utiliser pour localiser une ressource distribuée à côté de ce module. L'appel passe par une capacité serveur remplaçable et apporte le typage du chemin ; il conserve cette indirection plutôt que de lire directement `import.meta.dirname` dans l'application. La fonction s'appuie sur les métadonnées disponibles dans l'environnement d'exécution ; elle ne reconstruit pas une arborescence source supprimée par un bundler.

`setCurrentWorkingDirectory` reçoit un chemin absolu et renvoie `Ok` ou `Fail` ; `setCurrentWorkingDirectoryOrThrow` lève une erreur en cas d'échec. Changer de dossier affecte les opérations suivantes du processus utilisant des chemins relatifs. Pour simplement viser une ressource, résoudre son chemin depuis l'origine appropriée.

## Arguments et fin du processus

`getProcessArguments()` fournit les arguments utilisateur sans les entrées de lancement du runtime. Pour leur syntaxe, leur validation, les options ou les sous-commandes, utiliser le skill `duplojs-command`.

`exitProcess(code)` délègue la terminaison à l'environnement courant. Décider du code de sortie au point d'entrée qui interprète le résultat global ; les fonctions réutilisables transmettent leurs échecs pour que l'appelant choisisse la suite. Toutes les fonctions communes ne retournent pas un `Either` : respecter la signature de chacune plutôt que d'appliquer un traitement uniforme.
