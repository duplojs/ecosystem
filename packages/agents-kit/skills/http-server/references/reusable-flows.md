# Checkers, processus et builders communs

## Checker : réutiliser l'opération

Un checker encapsule une opération avec un input et des résultats nommés. Le créer avec `useCheckerBuilder().handler(...)` et retourner les résultats avec `output(information, value)`. Il peut adapter les `Either` d'un repository ou d'une capacité applicative ; il ne choisit pas leur statut HTTP.

Voir [le checker de recherche d'utilisateur](examples/user-checker.ts). Sa capacité de recherche est déclarée avec `declare function` et doit être raccordée à l'application avant exécution. Pour l'utiliser avec `.check(...)`, fournir :

- `input` : calcul de l'argument depuis le floor courant ;
- `result` : information du résultat permettant de continuer ;
- `otherwise` : contrat de réponse si le résultat attendu n'est pas obtenu ;
- `indexing` : clé sous laquelle ajouter la valeur retenue au floor, si elle doit être réutilisée.

L'[exemple de lecture](examples/user-route.ts) interprète ainsi un checker pour une route. Le résultat sélectionné est garanti aux étapes suivantes ; l'autre résultat termine le flux avec la réponse déclarée.

## Preset : réutiliser l'interprétation HTTP

Quand une opération attend toujours le même résultat et produit la même réponse sinon, nommer cette politique avec `createPresetChecker`. Le checker reste réutilisable avec d'autres interprétations ; le preset fixe son usage récurrent.

Appliquer ensuite `.presetCheck(...)`, fournir l'input depuis le floor et choisir une indexation locale avec `.indexing(...)`. L'[exemple de modification](examples/rename-user-route.ts) réutilise le preset défini dans [le module du checker](examples/user-checker.ts).

Ne pas répéter des `cut` pour rechercher la même ressource et renvoyer la même réponse d'absence. Utiliser un checker pour l'opération et un preset pour cette politique commune.

## Process : réutiliser une séquence

Créer un process avec `useProcessBuilder()`, enchaîner ses étapes, puis le finaliser avec `.exports(...)`. Son floor est local : les données de la route appelante ne deviennent pas implicitement son contexte, et toutes ses données internes ne deviennent pas le floor de la route.

Déclarer les clés exposées avec `.exports([ ... ])`. Au point d'appel, `.exec(process, { imports: [ ... ] })` récupère les clés nécessaires parmi ces exports. Utiliser les options du process si son comportement doit être paramétré ; consulter les signatures pour leur passage depuis le floor appelant.

Voir [le process d'authentification](examples/authentication.ts) et son [exécution explicite dans une route](examples/protected-route.ts). La vérification du token est un contrat déclaré à implémenter selon la politique de sécurité du projet. Le process peut lui-même produire une réponse qui arrête le traitement. Son export décrit uniquement ce que la suite peut récupérer après réussite.

## Preflight : préparer une famille de routes

Pour appliquer systématiquement un ou plusieurs processus avant les étapes propres à chaque route, partir de `usePreflightBuilder()`. Ajouter les processus avec `.exec(...)`, en précisant les imports, puis exposer sa fonction `.useRouteBuilder` sous un nom reflétant la politique commune.

L'[exemple d'authentification](examples/authentication.ts) expose `useAuthenticatedRouteBuilder`. Cette fonction crée une route équipée du preflight ; chaque route construite avec elle dispose de l'utilisateur garanti dans son floor. Les vérifications du process passent avant ses propres extractions et traitements.

Utiliser ce builder pour toutes les routes de la famille concernée. Voir [une route protégée](examples/protected-route.ts). Une route qui appelle directement le builder de base ne reçoit pas automatiquement la politique du builder personnalisé.

Pour approfondir, rechercher les routines HTTP dans `docs/concepts.llms.md`. Consulter les ressources de sécurité du projet pour l'implémentation de vérification des tokens ; le builder assemble cette vérification et ne définit pas lui-même sa politique cryptographique.
