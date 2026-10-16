# Fichiers, chemins et erreurs

## Choisir l'opération

Choisir l'opération selon le résultat nécessaire et vérifier sa signature publique. Pour une capacité absente de cette sélection, rechercher le mécanisme dans `docs/concepts.llms.md` :

| Besoin | API à considérer |
| --- | --- |
| Lire ou écrire du texte, du binaire ou du JSON | `readTextFile` / `writeTextFile`, `readFile` / `writeFile`, `readJsonFile` / `writeJsonFile` |
| Ajouter du contenu sans remplacer le précédent | `appendTextFile`, `appendFile` |
| Créer un dossier et ses parents si nécessaire | `ensureDirectory` |
| Créer un fichier absent sans tronquer un fichier existant | `ensureFile` ; préparer le dossier parent séparément |
| Créer une ressource temporaire | `makeTemporaryFile`, `makeTemporaryDirectory` |
| Lister des chemins ou obtenir des interfaces d'entrées | `readDirectory`, `walkDirectory` |
| Obtenir les métadonnées de la ressource ou du lien lui-même | `stat`, `linkStat` |
| Copier, déplacer, renommer ou supprimer | `copy`, `move`, `rename`, `relocate`, `remove` selon leur contrat et leurs options |

`readDirectory` renvoie des chemins relatifs au dossier lu par défaut ; demander `absolute: true` pour des chemins absolus, et `recursive: true` pour descendre dans les sous-dossiers. `walkDirectory` renvoie un générateur d'interfaces de fichiers, dossiers ou entrées inconnues ; choisir explicitement la récursivité et discriminer les interfaces avant d'employer leurs opérations spécifiques.

`exists` retourne un `Either`, pas un booléen. Pour distinguer un fichier d'un dossier et conserver les diagnostics d'échec, utiliser `stat` ou `createEntryInterface`. Les raccourcis `isFile()` / `isFolder()` des interfaces renvoient `false` lorsqu'ils ne peuvent pas confirmer la nature de la ressource ; ils ne permettent pas de récupérer tous les diagnostics.

## Séparer chemin, référence et état du disque

Une string dynamique doit être validée par `DPath.create`, `createAbsolute` ou `createSegment` selon son usage. Utiliser les fonctions de résolution de `DPath` pour assembler les chemins. La validité du chemin reste une garantie sur sa représentation ; elle ne prouve pas l'accès au système de fichiers.

`createFileInterface` et `createFolderInterface` construisent une référence sans créer ni inspecter la ressource. `createEntryInterface` effectue une inspection pour choisir l'interface appropriée. Les méthodes des interfaces délèguent aux opérations du domaine ; lire ou écrire le contenu passe par les fonctions qui prennent leur `.path`. Les opérations de déplacement ou de renommage renvoient la nouvelle interface dans leur résultat de réussite : utiliser ce résultat pour les opérations suivantes.

Une vérification préalable d'existence ne garantit pas la réussite de la lecture ou de l'écriture suivante. Traiter le résultat de l'opération effective, même après validation d'une précondition.

## Préserver les diagnostics et arrêter sur échec

Pour une opération telle que `readTextFile`, le résultat porte `file-system-read-text-file` en réussite ou `file-system-read-text-file-error` en échec. La valeur du `Left` est une union de `DuploJSError` portant les identifiants précis, tels que `file-system-read-text-file-not-found` et `file-system-read-text-file-permission-denied`. Ces identifiants précis ne sont pas les informations du `Left` extérieur.

Après sélection du `Left` avec `DEither`, utiliser `DPattern.matchWithError` pour couvrir toutes les erreurs déclarées, ou `matchWithErrorOtherwise` pour traiter un cas et conserver les autres. Ne pas dépendre du message d'erreur ni des codes natifs du runtime. Voir [lecture avec absence explicitement tolérée et écriture séquencée](examples/files.ts).

Pour plusieurs opérations dépendantes, composer avec `DEither.rightAsyncPipe` : la première erreur est conservée et les étapes suivantes ne s'exécutent pas. Chaque étape reçoit la valeur déballée du `Right` précédent. Consulter les concepts `Either` pour les règles de composition et d'adaptation des résultats.

`readJsonFile` parse le JSON et en retourne une valeur `DCommon.Json` ; il ne prouve pas le contrat de l'application. Faire ensuite vérifier cette valeur par une data structure, en conservant la différence entre échec de lecture et contenu invalide.
