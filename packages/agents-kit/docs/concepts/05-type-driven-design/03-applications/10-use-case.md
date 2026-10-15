### Conception des use cases en Type-Driven Design

Orchestration applicative des agrégats, sélection et propagation des résultats Either, ports et injection avec Reader, résolution des effets et persistance.
---

### Rôle de la couche applicative

La couche applicative se situe sous le domaine et au-dessus de l'infrastructure. Un **use case orchestre techniquement les agrégats** : préparer leurs entrées et leurs preuves, sélectionner les résultats permettant de poursuivre, appeler les agrégats, traiter leurs sorties, exécuter les résolveurs et sauvegarder les données.

Les règles et les transitions métier restent dans le [domaine](../02-domains/20-aggregates.md). L'application décide de l'enchaînement des opérations et de la persistance à travers des ports abstraits ; l'infrastructure implémente ces ports avec les outils concrets. Les use cases peuvent être transportés avec le domaine dans une autre application si les implémentations respectent ces contrats.

Un agrégat reste une fonction pure : les mêmes entrées produisent le même résultat métier et les mêmes besoins d'effets. Un use case équipé de ports impurs dépend aussi de l'état extérieur ; les mêmes paramètres ne garantissent donc pas le même résultat. Les frontières et les opérations autorisées entre les couches sont décrites dans [l'architecture](../01-architecture/10-boundaries.md).

### Composer les résultats avec Either

Les opérations utilisées par les use cases renvoient souvent des monades `Either`. Leur statut et leur information permettent de sélectionner les résultats souhaités, de poursuivre le cas positif et de propager les échecs.

| Besoin | Outil |
| --- | --- |
| Enchaîner les étapes du cas positif | `DEither.rightPipe` transmet la valeur des `Right` aux étapes suivantes ; dès qu'un `Left` apparaît, il le retourne sans exécuter la suite. `rightAsyncPipe` attend également les étapes asynchrones. |
| Choisir quels résultats autorisent la poursuite | `keepAsRightByInformation` ou `keepAsRightSelection` classe les variantes souhaitées à droite et les autres à gauche. |
| Réunir plusieurs résultats nécessaires à une étape | `group` ou `asyncGroup` rassemble les valeurs des `Right` dans un `Success`, ou retourne le premier `Left`. Fournir des getters permet de ne pas exécuter les opérations suivantes après un échec. |
| Traiter un résultat précis | Les fonctions de discrimination, comme `whenHasInformation` et `matchInformation`, permettent de définir la suite selon l'information du résultat. |

Un échec prévu par le domaine reste un résultat à gérer par les couches appelantes. Un `Left` porte une information discriminante et n'est pas automatiquement une erreur technique ; une erreur imprévisible est normalement levée. `unwrapRight` intervient seulement après la discrimination, lorsqu'une seule branche pertinente reste à poursuivre.

Voir les fondamentaux : [composition et propagation des échecs](../../01-fundamental/03-either/30-composition.ts), [adaptation des résultats](../../01-fundamental/03-either/40-result-adaptation.ts), [discrimination](../../01-fundamental/03-either/10-discrimination.ts) et [traitement exhaustif](../../01-fundamental/03-either/20-exhaustive-handling.ts).

### Préparer les préconditions de l'agrégat

Dans [`CreateBookUseCase`](../fixtures/business/applications/useCases/createBook.ts), `bookRepository.titleIsAlreadyRegistered` retourne le résultat de la vérification du titre. `keepAsRightByInformation("title-not-registered")` conserve le cas souhaité à droite et classe `title-already-registered` à gauche.

Le `rightAsyncPipe` fournit alors à l'[agrégat `createBook`](../fixtures/business/domains/aggregates/createBook.ts) le titre portant la preuve `title-not-registered` et l'identifiant généré portant `generated`, puis sauvegarde le livre produit. Si le titre est déjà enregistré, le résultat à gauche est retourné sans génération d'identifiant, appel d'agrégat ni sauvegarde.

La sélection conserve les preuves et rend l'appel type-safe. L'implémentation du repository doit réellement établir les garanties qu'elle annonce. Voir [les repositories](../02-domains/30-repositories.md) et [les évidences](../../01-fundamental/06-modeling/50-evidence.ts).

Les garanties peuvent aussi être exigées de l'appelant : [`ClientRentBookUseCase`](../fixtures/business/applications/useCases/clientRentBook.ts) reçoit déjà un client portant `CanRentBookFlag` et un livre portant `AvailableFlag`, qualifiés dans la [route de location](../fixtures/infrastructure/http/routes/clientRentBook.ts).

### Déclarer les ports et construire le Reader

Un **port décrit une capacité nécessaire à l'application**. Il peut reprendre un contrat de repository du domaine et le compléter : [`BookRepositoryPort`](../fixtures/business/applications/ports/book.ts) étend `BookRepository` avec `save`, car la décision de sauvegarder appartient à l'application.

`save` n'est pas une obligation générale des repositories. Cette méthode appartient au port applicatif lorsque le domaine ne fixe pas lui-même le moment, le contexte ou les garanties de la sauvegarde. Si le métier exige une sauvegarde particulière, la dépendance doit être exprimée dans le contrat et, si nécessaire, par une `Evidence`.

Le port associe une interface TypeScript à une constante créée avec `DInvocation.createPort<Interface>()`. L'interface décrit les signatures ; la constante représente la dépendance au runtime. Dans l'infrastructure, la constante du port, par exemple `BookRepositoryPort`, expose `createImplementation` et reçoit une implémentation compatible avec ce contrat.

Le use case utilise la monade **Reader** de `@duplojs/lang/invocation`. `DInvocation.createReader` reçoit les ports nécessaires et une fonction qui reçoit leurs implémentations, puis retourne la fonction du cas d'utilisation. Les dépendances sont injectées lors de la résolution du Reader ; les paramètres métier sont fournis ensuite à la fonction obtenue.

Pour un port, Reader met la première lettre de la clé de dépendance en minuscule et retire le suffixe final `Port` : `BookRepositoryPort` correspond à `bookRepository`. **L'injection doit respecter ce nom et la signature du port.** Un Reader peut aussi dépendre d'autres Readers, résolus à partir des ports fournis.

Dans l'infrastructure, `Reader.run` résout un use case isolé ; `DInvocation.resolveReaders` résout un ensemble avec tous les ports nécessaires. La [fixture de résolution](../fixtures/infrastructure/useCases/index.ts) produit ainsi `useCases.clientRentBookUseCase`, appelable depuis n'importe quel point d'entrée respectant sa signature.

Un use case peut dépendre d'un autre `Reader` ; ses dépendances sont alors incluses dans celles du reader courant. Le même port peut être partagé par plusieurs readers.

### Résoudre les effets et décider de la persistance

**Reader fournit les dépendances du use case ; Resolver exécute les effets déclarés par l'agrégat.** L'[agrégat `clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts) retourne les nouvelles entités et le besoin `sendInformationalEmail`, sans envoyer lui-même de courriel.

Le [use case de location](../fixtures/business/applications/useCases/clientRentBook.ts) fournit `emailRepository.sendRentInformationalEmail` à `resolver.resolve`, puis sauvegarde le client et le livre. Le [use case de retour](../fixtures/business/applications/useCases/clientGiveBackBook.ts) résout de même `rankBookAvailability` avant de sauvegarder.

L'ordre appartient au use case selon le besoin de l'opération. Si la sauvegarde doit précéder les effets, `Resolver.runAndResolve` permet d'attendre cette étape avant de les déclencher. Si un effet doit réussir avant la sauvegarde, arrêter la composition lorsqu'il renvoie un `Left`. Une transaction peut être coordonnée par un port ; l'application en définit le périmètre et l'infrastructure fournit le mécanisme. `promiseObject` exécute plusieurs sauvegardes en parallèle, sans fournir d'atomicité par lui-même.

### Démarche d'implémentation

1. Lire les contrats des agrégats : entrées, preuves, résultats et effets attendus.
2. Définir les paramètres du use case et les ports nécessaires, puis créer le Reader.
3. Préparer les entrées et composer les résultats Either pour poursuivre les branches souhaitées et propager ou traiter les autres.
4. Appeler les agrégats, résoudre leurs effets et sauvegarder leurs résultats dans l'ordre requis.
5. Fournir les implémentations de ports et résoudre les use cases dans l'infrastructure.
