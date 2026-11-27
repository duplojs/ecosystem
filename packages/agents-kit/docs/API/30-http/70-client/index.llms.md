## Client

Construire un client typé et gérer les échanges avec le serveur.

### Construction

Créer un client et définir son contrat.

#### [createHttpClient](10-construction/10-createHttpClient.ts)

Créer un client HTTP avec ou sans contrat et configurer son protocole.
 
#### [RouteDeclarationToContract](10-construction/10-routeDeclarationToContract.ts)

Obtenir le contrat d'une route pour typer les requêtes et les réponses du client.
 
### Requêtes

Construire les requêtes, leurs paramètres et leurs headers par défaut.

#### [HttpClient.addDefaultHeader et addDefaultHeaders](20-request/10-defaultHeaders.ts)

Fournir des headers communs fixes ou calculés à chaque requête.
 
#### [HttpClient.request, get, post, put, patch et delete](20-request/10-request.ts)

Construire et lancer une requête avec ses données et options.
 
### Réponses

Observer, sélectionner et traiter les réponses et les erreurs de requête.

#### [PromiseRequest.iWant et iSelectExpectedResponseByInformation](30-response/10-iWant.ts)

Sélectionner les réponses acceptées et conserver les refus dans un Either.
 
#### [PromiseRequest.OrThrow](30-response/10-orThrow.ts)

Obtenir la réponse sélectionnée ou lever une exception à la frontière finale.
 
#### [PromiseRequest et réponse HTTP](30-response/10-promiseRequest.ts)

Attendre une requête et distinguer réponse reçue et erreur de requête.
 
#### [PromiseRequest.toEitherByInformation et toEitherByCode](30-response/10-toEither.ts)

Répartir les réponses du contrat dans un Either selon leur information ou leur code.
 
#### [PromiseRequest.when](30-response/10-when.ts)

Observer les réponses ou les erreurs sans sélectionner le résultat.
 
### Hooks

Configurer les traitements communs et les intercepteurs locaux aux requêtes.

#### [Hooks et intercepteurs](40-hooks/10-clientHooks.ts)

Transformer ou observer un échange globalement ou pour une seule requête.
 
### Flux

Consommer les réponses progressives.

#### [Server-Sent Events](50-streaming/10-sse.ts)

Sélectionner et consommer les événements SSE typés d'une réponse.
 
#### [Flux de données](50-streaming/10-stream.ts)

Consommer des chunks texte ou binaires sans les confondre avec les SSE.
 
### Cache

Configurer les clés et contrôler le cache applicatif du client.

#### [Cache applicatif](60-cache/10-clientCache.ts)

Choisir la clé, contourner ou actualiser le stockage en mémoire du client.
 
