# Client typé, attentes et flux

## Choisir le contrat et configurer le client

Le client HTTP est utilisable partout où une application effectue une requête HTTP, que l'API soit développée avec DuploJS ou avec une autre technologie. `createHttpClient<Routes>` accepte un type compatible avec `ServerRoute` : chaque route décrit sa méthode, son chemin, ses entrées et l'union de ses réponses. Les types peuvent être écrits à la main, importés ou composés. La génération depuis un serveur DuploJS est une façon de produire ce contrat ; elle ne génère pas un client et n'est pas un prérequis à son utilisation. Pour configurer cette génération, utiliser le skill `duplojs-http-server` ou rechercher le partage des contrats HTTP dans `docs/concepts.llms.md` du package installé.

Décrire précisément les requêtes et les réponses connues, y compris les erreurs contractuelles. Éviter de perdre ces garanties avec un client non paramétré ou des assertions sur les résultats. Le typage décrit le contrat supposé de l'API ; il n'effectue pas de validation runtime du body. Utiliser une data structure lorsque cette validation est nécessaire.

Créer un client par configuration d'API. Y placer l'URL de base, les options globales telles que `credentials` et `cache`, les headers par défaut et les hooks transversaux. Un header peut être calculé à chaque requête, par exemple pour récupérer le token courant. Les paramètres d'un appel peuvent préciser ses headers, ses options `initParams` et son `abortController`. Voir [un client pour une API externe](examples/external-client.ts), avec un contrat écrit à la main, sans header `information` ni `predicted`.

## Distinguer le client et la PromiseRequest

Le client porte les comportements communs : `addRequestHook`, `addResponseHook`, `addErrorHook` et les hooks ciblant une information, un code ou une famille de réponses. Les hooks de requête et de réponse peuvent transformer leur entrée ; retourner la valeur destinée à la suite du cycle. Les réactions globales telles que les loaders ou la journalisation se placent à ce niveau.

Chaque appel retourne une `PromiseRequest`, représentation de cet échange. Lui attacher immédiatement les traitements locaux avant `await` : les `when*` enregistrent des callbacks et renvoient la même `PromiseRequest`. Ils permettent de composer plusieurs réactions sans sélectionner ni extraire le résultat. `addRequestInterceptor` et `addResponseInterceptor` permettent les transformations locales. `whenError` traite une erreur de requête ; `whenNotPredictedResponse` observe une réponse sans marqueur lorsque le mode de réponses prévues est actif.

Les méthodes d'attente transforment ensuite le résultat en une promesse de réponse ou d'`Either`. Choisir l'attente après les hooks locaux ; un appel à `iWant*` ne renvoie plus une `PromiseRequest`. Voir [les attentes et sélecteurs](examples/client-expectations.ts).

| Besoin | Choix et résultat après `await` |
| --- | --- |
| Réagir à un cas sans modifier le résultat | `whenInformation`, `whenCode` ou une famille `when*` ; callback avec la réponse ciblée |
| Exiger un cas précis | `iWantInformation` ou `iWantCode` ; `Right<"response", RéponseVoulue>` ou un `Left` |
| Obtenir directement la réponse ou interrompre le flux | Variante `OrThrow` ; réponse voulue ou exception |
| Répartir toutes les informations du contrat entre résultats voulus et non voulus | `iSelectExpectedResponseByInformation` ; sélecteur exhaustif `true` / `false`, résultat sous `Either` |
| Discriminer les `Right` par l'information de la réponse | `toEitherByInformation` ; sélecteur exhaustif, `Right<Information, Réponse>` pour les entrées `true` |
| Discriminer les `Right` par le code HTTP | `toEitherByCode` ; sélecteur exhaustif, `Right<"response-<code>", Réponse>` pour les entrées `true` |

Les sélecteurs exigent une décision pour chaque information ou code déclaré dans les réponses de la requête. Une évolution du contrat impose ainsi de revoir ce choix. `false` conserve la réponse dans un `Left<"unexpect-response", ...>` ; les erreurs de requête restent des `Left<"request-error", ...>`. Les `Left` ne prennent pas le nom de l'information ou du code rejeté. Traiter ces branches avec les outils `Either` ; une réponse non voulue n'est pas supprimée silencieusement. Les variantes `OrThrow` lèvent une erreur pour ces branches, y compris les erreurs de requête.

La famille `ExpectedResponse` sans sélecteur (`whenExpectedResponse`, `iWantExpectedResponse`) regroupe les codes `2xx` et `4xx`. Elle ne signifie pas « tous les codes déclarés dans le contrat » et ne remplace pas le choix des cas utiles à l'application. Pour un scénario précis, sélectionner l'information attendue, ou le code si l'API ne fournit pas d'information.

## Réponses prévues et mode Predicted

Une réponse **prévue** appartient aux réponses contractuelles de l'API. Elle peut être un succès ou une erreur métier, par exemple un `404` déclaré. Une réponse **voulue** est celle que le consommateur décide d'accepter à cet endroit du programme. Une réponse prévue peut donc être rejetée par un sélecteur.

DuploJS marque ses réponses contractuelles : les réponses `PredictedResponse` et leurs équivalents SSE et stream conduisent le serveur à ajouter le header `predicted`. Cette classe marque la réponse ; elle n'ajoute pas de traitement métier. Une erreur de parsing du body ou une erreur interne hors contrat peut produire une réponse imprévue. Son code ou son information peut coïncider avec celui d'une réponse déclarée, sans garantir le même body.

Par défaut, `disabledPredictedMode` vaut `false`. Le client vérifie la **présence** du header indiqué par `predictedHeaderKey` (`predicted` par défaut). Sans ce header, les hooks ciblés par information, code ou famille ne s'exécutent pas et les attentes et sélecteurs renvoient `Left<"unexpect-response", ...>`, même si le code ou l'information correspond. Cela évite d'utiliser sous un type contractuel le contenu d'une autre réponse. Les hooks généraux de réponse et le hook dédié aux réponses imprévues restent disponibles.

Cette règle concerne les attentes : un `await` direct sur la `PromiseRequest`, sans sélection, conserve une réponse HTTP reçue dans un `Right<"response", ...>`, y compris sans marqueur. Utiliser une attente pour obtenir la réponse correspondant au besoin ; ne pas confondre réception d'une réponse et acceptation de son contrat.

Pour une API **sans ce marqueur**, créer son client avec `disabledPredictedMode: true`. Les attentes se fondent alors sur le code ou l'information sans imposer le header. Si l'API ne fournit pas non plus d'information, déclarer explicitement `information?: undefined` dans chaque réponse du contrat pour conserver l'inférence des réponses avec l'API actuelle, puis sélectionner par code. Si seuls les noms des headers diffèrent, configurer `predictedHeaderKey` et `informationHeaderKey` selon le protocole de l'API. Conserver le mode actif pour une API DuploJS qui fournit le marqueur. Le marqueur est une convention du protocole, pas une validation du contenu ni une preuve d'authenticité.

## Consommer progressivement un flux

Décrire les événements SSE avec `responses.events` et les données d'un stream avec `responses.flux`. Après sélection de la réponse, consommer l'itérateur asynchrone pour traiter les éléments au fur et à mesure, ou enregistrer les callbacks puis lancer la consommation. Voir [SSE et stream](examples/client-streams.ts).

- **SSE** : `onReceiveEvent` cible un événement typé, `onStreamEvent` observe le cycle, `consumeEventStream` lance la lecture et `closeEventStream` ferme le flux. La réponse est reconnue par le content-type `text/event-stream`.
- **Stream** : `onStream` observe notamment `receiveData`, `consumeStream` lance la lecture et `closeStream` ferme le flux. Cette couche est activée par le header `x-duplojs-body-options` contenant `stream` ; les chunks sont décodés en texte si le content-type contient `text`, sinon ils restent des `Uint8Array`. Les chunks ne sont pas nécessairement des messages applicatifs complets : gérer le découpage si le protocole l'exige.

`whenReceiveServerEvent` et `whenReceiveDataStream` permettent aussi d'attacher les callbacks depuis la `PromiseRequest` ; ils ne lancent pas à eux seuls la consommation. Les hooks globaux du client peuvent instrumenter le démarrage, la réception, les erreurs et la fermeture. Le mode de réponses prévues s'applique également à ces réponses : le désactiver pour un fournisseur sans marqueur. Le typage seul ne transforme pas un flux arbitraire en SSE ou en stream reconnu par cette couche ; vérifier les headers et le format de l'API.

Pour les exemples complémentaires d'initialisation, d'envoi de formulaires et de hooks globaux, rechercher le client HTTP dans `docs/concepts.llms.md` du package installé.
