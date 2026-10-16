# Résultats typés et exceptions

## Choisir selon la place de l'échec dans le traitement

Identifier les issues prévisibles que l'appelant doit pouvoir exploiter, puis les exprimer dans le contrat `Either`. Un refus peut concerner une règle métier, une vérification ou une manipulation technique. Une opération sur l'environnement ne justifie donc pas à elle seule une exception. Pour la distinction conceptuelle avec une défaillance de l'environnement, lire « Conversion des absences et exceptions en résultats » depuis le routeur du package installé.

Lorsqu'une fonction renvoie un `Either` dans une branche, toutes ses branches renvoient un `Either` : `DEither.Right` pour la réussite et `DEither.Left` pour le refus. Envelopper aussi une réussite sans valeur avec `DEither.ok()`, plutôt que retourner `undefined` à côté d'un `Left`. L'information identifie le cas ; la valeur associée transporte les détails utiles. Voir [une fonction qui propage les échecs de lecture](examples/error-propagation.ts).

Le `Left` de lecture reste visible dans le type de retour. Une autre fonction peut le propager, l'adapter ou tenter une récupération. Une absence de ressource exploitable par l'algorithme ne devient pas une panne d'environnement parce qu'elle provient d'une I/O. Ne pas la masquer par un `throw` ou un unwrap qui lève.

`DEither.rightPipe` et `DEither.rightAsyncPipe` composent les étapes sur les valeurs de réussite et arrêtent au premier `Left`. `DEither.isRight` et `DEither.isLeft` permettent une discrimination explicite avant `unwrapRight` ou `unwrapLeft`.

Pour une API qui lève sur un refus prévisible, adapter ses erreurs documentées en résultats. `DEither.safeCallback` et `DEither.asyncSafeCallback` capturent les exceptions ; examiner ensuite la cause pour distinguer le refus attendu d'une défaillance imprévue. Conserver une cause technique capturée dans le résultat jusqu'à sa consommation finale, sans la requalifier en refus métier ni la relancer depuis l'adaptation réutilisable. Préférer d'abord l'API DuploJS sûre si elle existe ; ne pas capturer systématiquement les exceptions des dépendances.

## Le consommateur final décide de l'effet

La frontière d'exécution consomme le résultat après le retour des fonctions appelées et décide de sa conséquence finale. C'est à ce stade que le code applicatif peut écrire un `throw` ou utiliser `OrThrow` pour interrompre l'exécution. Déclarer une fonction au niveau d'un module ou l'appeler depuis un point d'entrée ne lui donne pas cette responsabilité.

Exemples : initialisation du programme, callback d'une commande ou handler d'une route.

```text
entrée externe
  → validation par les schémas du module
  → point d'entrée du traitement
    → fonction applicative
      → sous-fonction : renvoie les issues prévues en Right ou Left
    ← résultat typé
  ← résultat typé
  → le point d'entrée décide de l'effet final
```

Les fonctions applicatives et leurs sous-fonctions renvoient les refus prévisibles dans leur contrat de retour, sans créer leurs propres `throw`. Les exceptions déjà émises par les dépendances ou le runtime remontent implicitement à travers ces appels ; cette propagation ne demande pas d'ajouter un `throw`.

À cette frontière, interpréter le `Left` selon le contrat d'exécution : par exemple produire une réponse HTTP, un diagnostic de commande ou une exception adaptée. Le fait qu'un appelant ignore le retour d'une fonction ne suffit pas à autoriser cette fonction à lever une exception.

## Choisir entre version sûre et `OrThrow`

Préférer une déclaration sûre pour une valeur connue. Pour une opération qui peut échouer, examiner les branches que `OrThrow` convertirait en exceptions avant de choisir cette variante.

| Situation | Choix |
| --- | --- |
| Constante dont la validité est prouvable | `cast`, `infer`, helper de déclaration ou surcharge littérale sûre |
| Vérification d'une donnée externe ou valeur runtime sans preuve | Validation ou fabrique sûre, puis traitement du `Either` |
| Refus prévisible d'une fonction réutilisable, métier ou technique | Renvoyer, propager ou adapter le `Left` |
| Exception de défaillance imprévue émise par une dépendance ou le runtime | La laisser remonter implicitement ; propager le résultat si elle a été capturée |
| Point d'entrée décidant de l'effet final d'un résultat | Interpréter le `Left`, puis produire la réponse, la fin d'exécution ou l'exception adaptée |
| Test affirmant un résultat attendu | `OrThrow` permet de faire échouer le test si le résultat diffère |

La commodité de l'extraction, la rareté supposée d'un refus ou la complexité de propagation ne changent pas sa nature. Une variante qui lève sur une absence exploitable ne convient pas à une fonction réutilisable qui doit transmettre ce cas.

## Démarrage et tests : interpréter le résultat

Au démarrage, l'initialisation peut décider qu'une configuration invalide empêche l'exécution. `environmentVariableOrThrow` valide d'abord par la version sûre, puis traduit son `Left` en exception. Cet usage exprime la décision finale du point d'entrée ; une fonction qui doit transmettre le refus utilise `environmentVariable`.

Voir [la validation de l'environnement au démarrage](examples/environment-initialization.ts). Pour les entrées reçues pendant le fonctionnement du logiciel, conserver les résultats de validation jusqu'à leur interprétation par la frontière concernée.

En tests, `OrThrow` peut extraire le résultat attendu ou préparer une fixture : une issue différente doit interrompre le test. Une déclaration sûre reste adaptée aux constantes connues, comme dans [les déclarations sûres](examples/safe-declarations.ts). Le code testé conserve ses résultats ; ces assertions ne justifient pas de le faire lever sur ses refus prévisibles.

Pour approfondir, rechercher les `Either`, l'environnement ou le contexte d'exécution concerné dans `docs/concepts.llms.md`, depuis la racine AgentKit indiquée par les instructions du projet.
