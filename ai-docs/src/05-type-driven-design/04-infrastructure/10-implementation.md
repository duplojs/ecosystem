### Implémenter les ports applicatifs et exposer les use cases depuis l'infrastructure

Fournir les dépendances concrètes de l'application et adapter les capacités métier aux points d'entrée du système, notamment HTTP.

---

### Rôle de l'infrastructure

L'infrastructure est la couche qui relie l'application aux systèmes concrets : base de données, services externes, génération d'identifiants, envoi de messages ou serveur HTTP. Elle dépend des contrats exposés par le domaine et l'application ; le domaine et les use cases ne dépendent pas d'une technologie d'infrastructure.

Les ports sont déclarés du côté de l'application parce qu'ils expriment les capacités dont un use case a besoin. Leur implémentation appartient à l'infrastructure, qui choisit la technologie et adapte ses résultats au contrat attendu. Cette séparation permet de remplacer une base de données, un service d'email ou un point d'entrée sans déplacer les règles métier.

Les règles sur le sens des dépendances et les opérations interdites dans cette couche sont détaillées dans [les frontières de l'architecture](../01-architecture/10-boundaries.md). Une implémentation peut hydrater une donnée externe et appeler une qualification du domaine ; elle ne réalise pas une transition métier à la place d'un use case ou du domaine.

### Implémenter les ports

Une implémentation est créée avec `BookRepositoryPort.createImplementation` — ou la méthode correspondante du port — à partir du contrat applicatif. Elle doit fournir exactement les opérations et les garanties annoncées par l'interface : une opération qui retourne une entité doit l'hydrater, une opération qui produit une `Evidence` doit réellement exécuter l'étape correspondante et une opération qui renvoie un `Either` doit respecter les informations prévues par son contrat.

Les [implémentations des ports de la fixture](../fixtures/infrastructure/ports/index.ts) construisent ainsi `bookRepository`, `clientRepository` et `emailRepository` depuis `BookRepositoryPort`, `ClientRepositoryPort` et `EmailRepositoryPort`. Le même port peut être partagé par plusieurs use cases ; il n'est pas nécessaire de créer une implémentation différente pour chaque scénario applicatif.

### Résoudre les use cases

Les use cases sont des `Reader` : ils décrivent leurs dépendances au moyen des ports, puis reçoivent leurs implémentations au moment de la résolution. L'infrastructure fournit uniquement les ports effectivement demandés par les Readers et obtient des fonctions prêtes à être appelées par les points d'entrée.

`DInvocation.resolveReaders` résout un ensemble de use cases avec un même jeu d'implémentations. Dans la [fixture de résolution](../fixtures/infrastructure/useCases/index.ts), l'objet des use cases métier est associé aux repositories concrets ; le résultat expose par exemple `useCases.clientRentBookUseCase`. La résolution ne réimplémente pas l'orchestration métier : elle injecte seulement les ports dans les Readers.

Le nom des clés suit la convention de `Reader` : `BookRepositoryPort` devient `bookRepository`, et `ClientRentBookUseCase` devient `clientRentBookUseCase`. Les dépendances d'un Reader injecté sont également résolues à partir du même ensemble de ports. Un point d'entrée appelle le use case résolu avec ses paramètres métier et ne reconstruit pas ses dépendances.

### Adapter une capacité métier avec HTTP

Une route HTTP est un adaptateur d'entrée. Elle reçoit des données sérialisées, les valide et les transforme en valeurs utilisables par le métier, appelle le use case résolu, puis adapte le résultat vers une réponse HTTP. Elle appelle le use case correspondant à la capacité consommée ; elle peut appeler une fonction pure de qualification, mais ne déclenche pas directement un agrégat, une `Fact` ou un effet.

Le module `@duplojs/http` fournit les étapes nécessaires à cette adaptation :

- `useRouteBuilder` définit la méthode, le chemin et un flux d'étapes exécutées dans l'ordre ;
- `extract` valide les paramètres, la query, les headers et le body avec des `DataStructure` et les rend disponibles dans le `floor` de la route ;
- `check`, `presetCheck` et `cut` permettent de charger une donnée, d'interpréter un résultat et d'interrompre le flux avec une réponse HTTP ;
- `handler` reçoit uniquement les données préparées et termine le flux en appelant `response`.

Dans la [route de location](../fixtures/infrastructure/http/routes/clientRentBook.ts), les identifiants HTTP sont extraits, les repositories retrouvent le client et le livre, puis les fonctions pures `Client.canRentBook` et `Book.refineState` requalifient leurs états. Le handler appelle ensuite `useCases.clientRentBookUseCase` avec les entités portant les preuves attendues par le use case. La [route de retour](../fixtures/infrastructure/http/routes/clientGiveBackBook.ts) suit la même séparation.

La route définit aussi un contrat de sortie avec `ResponseContract`. Ce contrat associe un code HTTP, une `information` littérale et, lorsque c'est nécessaire, une `DataStructure` de body. L'information discrimine finement le résultat du flux ; le code conserve sa fonction protocolaire. Les erreurs métier prévues peuvent ainsi devenir des réponses comme `client.notHaveBook` ou `book.unavailable`, sans transformer la règle métier en logique HTTP.

Il n'est pas obligatoire de créer un DTO pour chaque route. Une route peut exposer directement une `DataStructure` du domaine lorsque le contrat le permet ; elle définit une structure spécifique si le client attend une autre forme ou si certaines propriétés ne doivent pas sortir du système. Voir aussi [l'entrée des données dans le modèle](../01-architecture/10-boundaries.md#faire-entrer-les-données-dans-le-modèle).

### Partager les contrats avec un client HTTP

Le contrat de route peut être transformé en type de routes par le `codeGeneratorPlugin` de `@duplojs/http`. Un client construit avec `createHttpClient<Routes>` réutilise alors les méthodes, chemins, paramètres, bodies et réponses déclarés par le serveur. L'appelant HTTP ne manipule pas une réponse anonyme : il sélectionne une `information`, traite un `Either` ou lève une erreur selon le contrat prévu.

La communication suit donc ce parcours :

```text
Port applicatif
  ↓ implémentation concrète
Use case résolu par Reader
  ↓ appel avec des données métier qualifiées
Route HTTP
  ↓ extract / check / cut / handler
ResponseContract typé
  ↓ contrat partagé
Client HTTP typé
```

Le serveur et le client partagent ainsi les formes d'entrée et de sortie sans partager la responsabilité des règles métier. Le serveur exécute les use cases et expose leurs résultats selon un contrat HTTP ; le client consomme ce contrat et choisit le traitement adapté à chaque réponse. Voir aussi [effectuer une requête HTTP](../../03-client/10-http/20-request.ts).

### Démarche d'implémentation

1. Lire les ports demandés par les use cases et identifier les systèmes concrets capables de les implémenter.
2. Créer une implémentation par port avec `createImplementation`, en respectant les résultats, les preuves et l'hydratation annoncés.
3. Résoudre les Readers avec `DInvocation.resolveReaders` et exposer les use cases obtenus aux points d'entrée.
4. Valider les données externes, qualifier les entités si nécessaire, appeler le use case puis traduire son résultat dans le contrat de l'interface.
5. Vérifier la cohérence des contrats d'entrée et de sortie avec le client consommateur.
