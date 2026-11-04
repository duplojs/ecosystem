### Ports : contrats des dépendances applicatives

Définir les capacités requises par l'application, étendre les résultats des contrats du domaine et rendre leurs implémentations injectables sans dépendre d'une technologie.

---

### Définir ce dont l'application dépend

Un port appartient à l'application et décrit une capacité extérieure requise par ses use cases : opérations, données acceptées et résultats possibles. Plusieurs use cases peuvent le partager ; chacun déclare seulement les dépendances dont il a besoin. Sa réalisation est fournie par l'infrastructure selon les [frontières de l'architecture](../01-architecture/10-boundaries.md).

### Prolonger les besoins exprimés par le domaine

Le port peut reprendre un [repository du domaine](../02-domains/30-repositories.md) et le compléter pour l'exécution des agrégats :

| Besoin applicatif | Construction illustrée par les fixtures |
| --- | --- |
| Utiliser une capacité déjà entièrement décrite par le domaine | [`EmailRepositoryPort`](../fixtures/business/applications/ports/email.ts) reprend `EmailRepository`, y compris la signature de l'opération de courriel. |
| Prendre en charge les entités transmises par les commits | [`BookRepositoryPort`](../fixtures/business/applications/ports/book.ts) et [`ClientRepositoryPort`](../fixtures/business/applications/ports/client.ts) étendent leurs repositories avec `save`. |
| Représenter les refus propres à l'exécution technique | [`WaitingListEntryRepositoryPort`](../fixtures/business/applications/ports/waitingListEntry.ts) complète les résultats de certaines méthodes et ajoute la sauvegarde des entrées. |

Reprendre un repository conserve une source unique pour ses entrées, ses résultats métier, ses évidences et ses fonctions signées. Le port n'en recopie pas les signatures pour les faire évoluer séparément. Un port peut aussi décrire un besoin purement applicatif sans repository correspondant dans le domaine.

La persistance générique peut rester applicative lorsque l'agrégat transmet une donnée par un commit. Dans la fixture de livre, `save` exige une entité portant un fait et conserve son type précis dans le résultat. Les garanties particulières, comme l'[exécution transactionnelle](./10-use-case.md#exécuter-lopération-dans-un-contexte-transactionnel), doivent être prévues par le contrat.

### Ajouter les résultats propres à l'exécution technique

L'application représente aussi l'impossibilité technique de fournir un résultat demandé par le domaine.

`AddAdditionalResultOnFunction` associe la fonction d'origine à une branche sans paramètres qui retourne le résultat supplémentaire. Cette branche retourne une promesse lorsque le résultat d'origine est une promesse ou un flux asynchrone. L'union conserve la signature d'origine, y compris ses génériques, au lieu de la reconstruire pour élargir son retour.

`AddAdditionalResultOnMethods` applique cette extension aux méthodes nommées dans une correspondance avec leurs résultats supplémentaires ; les autres gardent leur contrat. L'[implémentation d'une méthode aux résultats étendus](../04-infrastructure/10-implementation.md#implémenter-une-méthode-aux-résultats-étendus) utilise `withAdditionalResult` pour produire les différentes issues depuis une même fonction.

Dans `WaitingListEntryRepositoryPort`, `findNextPendingForBook` peut ainsi produire le `Left` `waiting-list-selection-unavailable`, et `findAllActiveByBook` le `Left` `waiting-list-stream-unavailable`. Ces refus transportent l'identifiant du livre concerné, sans changer les preuves exigées par l'agrégat pour continuer.

Le refus du flux porte sur l'obtention du flux lui-même : ce n'est pas une entrée supplémentaire à parcourir. Les éléments fournis par une lecture réussie conservent leur contrat métier et leur évidence.

L'absence d'inscription reste une issue normale de la sélection, distincte de l'impossibilité de chercher. Le [use case](./10-use-case.md#raccorder-chaque-demande-du-workflow) sélectionne les réponses qui satisfont l'agrégat et propage les refus.

### Associer le contrat à une référence de dépendance

La déclaration comporte deux éléments portant le même nom : l'interface TypeScript décrit les capacités et la constante créée par `createPort<Interface>()` représente le port au runtime. La fixture [`BookRepositoryPort`](../fixtures/business/applications/ports/book.ts) montre cette association.

Le use case déclare cette constante parmi les dépendances de `createReader`. Reader lui fournit alors une implémentation typée par l'interface. Pour une clé de port, le nom injecté commence par une minuscule et perd son suffixe final `Port` : la clé `BookRepositoryPort` donne accès à `bookRepository`. Le même nom est utilisé lors de la résolution.

Les paramètres métier du use case restent séparés de ces dépendances. Le port fournit une capacité partagée ; les entités, titres ou contextes qualifiés sont les valeurs propres à chaque appel.

### Confier la réalisation à l'infrastructure

`createImplementation` reçoit une implémentation compatible avec l'interface. L'[infrastructure](../04-infrastructure/10-implementation.md#implémenter-les-garanties-des-ports) établit les garanties du contrat puis fournit les implémentations aux Readers ; la compatibilité de typage ne vérifie pas leur réalisation au runtime.
