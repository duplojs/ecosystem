### Use cases : satisfaire les agrégats

Préparer les garanties requises, raccorder les workflows aux ports applicatifs et encadrer leur exécution, notamment transactionnelle.

---

### Implémenter les exigences du domaine

Un use case prépare ou reçoit les entrées d'un agrégat, l'appelle, satisfait les demandes de son workflow avec des ports et restitue son résultat. Il conduit cette exécution technique selon les [frontières de l'architecture](../01-architecture/10-boundaries.md), sans importer les implémentations d'infrastructure.

### Préparer les préconditions demandées

La signature détermine la préparation : un identifiant demande encore une recherche ; une entité qualifiée ou un contexte prouvé supposent ces garanties déjà établies. Le use case peut effectuer cette préparation ou la demander à son appelant.

| Fixture | Exigence et préparation |
| --- | --- |
| [`CreateBookUseCase`](../fixtures/business/applications/useCases/createBook.ts) | Reçoit un titre, appelle sa vérification et sélectionne `title-not-registered`. Fournit ensuite à l'agrégat ce titre prouvé et l'identifiant généré. |
| [`ClientRentBookUseCase`](../fixtures/business/applications/useCases/clientRentBook.ts) | Reçoit directement le client capable de louer et le livre disponible, avec leurs flags. |
| [`ClientGiveBackBookUseCase`](../fixtures/business/applications/useCases/clientGiveBackBook.ts) | Reçoit le contexte client-livre portant la preuve produite par le refinement. |
| [`WithdrawBookUseCase`](../fixtures/business/applications/useCases/withdrawBook.ts) | Reçoit un livre disponible ou réservé, selon la précondition du retrait. |

Dans la création, `keepAsRightByInformation("title-not-registered")` classe `title-already-registered` à gauche. Le `rightAsyncPipe` le propage sans générer d'identifiant, appeler l'agrégat ou sauvegarder de livre. Voir les [outils de composition](../../01-fundamental/03-either/30-composition.ts) et d'[adaptation Either](../../01-fundamental/03-either/40-result-adaptation.ts).

### Déclarer les dépendances du use case

Le use case déclare les capacités dont il a besoin avec `createReader`. Celui-ci reçoit les références des ports puis une fonction qui, à partir de leurs implémentations, construit la fonction du use case. Les paramètres métier sont fournis à cette dernière lors de chaque appel.

La déclaration des contrats, leurs extensions techniques et le nommage des dépendances injectées sont décrits dans le [chapitre des ports](./20-ports.md). Le use case consomme ces contrats sans connaître les adaptateurs qui les réalisent.

Reader fournit les dépendances ; `consumeWorkflow` satisfait les effets de l'agrégat. Un Reader peut aussi dépendre d'autres Readers ; leurs ports font alors partie des dépendances à fournir. L'[infrastructure](../04-infrastructure/10-implementation.md#résoudre-les-use-cases-une-fois-les-ports-fournis) résout cet ensemble pour exposer les fonctions applicatives.

### Raccorder chaque demande du workflow

La consommation associe une implémentation à chaque [demande du workflow](../02-domains/20-aggregates.md#faire-du-workflow-le-contrat-du-déroulement), selon les données et résultats exigés, y compris leurs évidences et signatures.

Dans le [use case de location](../fixtures/business/applications/useCases/clientRentBook.ts), `commit/book-and-client` sauvegarde les deux entités transmises et `commit/send-informational-email` reçoit la fonction signée du port de courriel.

Dans le [use case de retour](../fixtures/business/applications/useCases/clientGiveBackBook.ts), `resolve/next-pending-waiting-list-entry` appelle le repository et sélectionne ses deux issues normales comme `Right` ; le refus technique reste à gauche. Les commits sont raccordés aux sauvegardes correspondantes et à l'opération signée de disponibilité.

### Exécuter une itération sans déplacer les transitions

Le [use case de retrait](../fixtures/business/applications/useCases/withdrawBook.ts) raccorde `commit/withdrawn-book` et `commit/cancelled-waiting-list-entry` aux sauvegardes du livre et des inscriptions. Pour l'itération, il fournit `waitingListEntryRepository.findAllActiveByBook` comme `getIterator` et règle `concurrency` à cinq. Le même consommateur satisfait ainsi les commits du workflow imbriqué.

La concurrence reste un choix technique compatible avec le contrat métier. Si les traitements doivent respecter un ordre ou partager une garantie particulière, le contrat doit l'exprimer ; une configuration de concurrence ne l'établit pas.

### Propager les arrêts et respecter les garanties d'exécution

Un effet qui retourne un `Left` interrompt la consommation et propage ce résultat sans exécuter les étapes suivantes du workflow.

Cet arrêt n'annule pas les effets déjà exécutés. Dans le retrait, le livre a été transmis au premier commit avant l'ouverture du flux. Si celle-ci échoue, cette prise en charge a déjà eu lieu. Avec une itération concurrente, des traitements déjà engagés peuvent également avoir produit des effets.

Les sauvegardes parallèles d'un même commit ne constituent pas non plus une transaction. Si l'opération exige l'atomicité, une protection contre des modifications concurrentes ou une autre garantie d'exécution, cette exigence doit être prévue dans les contrats puis établie par les implémentations. Une évidence seule ne maintient pas une garantie dans le temps.

### Exécuter l'opération dans un contexte transactionnel

Le risque de modifications partielles concerne toute opération logicielle qui coordonne plusieurs écritures, indépendamment des workflows. Lorsque ces données doivent évoluer ensemble, prévoir une exécution transactionnelle dans les contrats. Le domaine peut exiger une capacité transactionnelle de repository et des évidences attestant que ses entrées ont été obtenues dans ce contexte ; ces preuves ne créent pas la transaction.

L'application demande cette capacité ; l'infrastructure ouvre la transaction et fournit les repositories liés à son contexte technique. Y appeler le workflow et attendre toute sa consommation, y compris ses itérations et sauvegardes, avant de valider la transaction. Les lectures qui établissent les préconditions doivent aussi utiliser ce contexte, ou leurs garanties doivent être réétablies à l'écriture. Tous les accès concernés passent par le même client ou gestionnaire transactionnel.

L'adaptateur doit demander l'annulation des écritures de cette transaction sur une exception ou un `Left` qui interrompt l'opération. Un `Left` est une valeur de retour normale : l'ORM ne le reconnaît pas automatiquement comme un motif de rollback. Le contrat transactionnel doit prévoir ce cas et restituer le refus après l'annulation ; la réussite n'est restituée qu'après validation de la transaction.

Cette atomicité porte sur les accès à la base participant à la transaction. Elle n'annule ni un courriel envoyé ni un appel HTTP déjà exécuté : leur coordination peut demander un envoi après validation ou l'enregistrement transactionnel d'une intention d'envoi à traiter ensuite. Les invariants soumis à la concurrence exigent également des contraintes de base, un niveau d'isolation ou des verrous adaptés. Un flux volumineux peut allonger la transaction ; son périmètre et ses limites doivent rester compatibles avec le contrat métier et les capacités du stockage.
