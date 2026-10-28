# Choisir et traiter les réponses

## Attentes et sélecteurs

Les méthodes d'attente transforment ensuite le résultat en une promesse de réponse ou d'`Either`. Choisir l'attente après les hooks locaux ; un appel à `iWant*` ne renvoie plus une `PromiseRequest`. Voir [les attentes et sélecteurs](examples/client-expectations.ts).

| Besoin | Choix et résultat après `await` |
| --- | --- |
| Réagir à un cas sans modifier le résultat | `whenInformation`, `whenCode` ou une famille `when*` ; callback avec la réponse ciblée |
| Exiger un cas précis | `iWantInformation` ou `iWantCode` ; `Right<"response", RéponseVoulue>` ou un `Left` |
| À la consommation finale du résultat, obtenir la réponse ou interrompre l'exécution | Variante `OrThrow` ; réponse voulue ou exception. Dans une fonction réutilisable, conserver le `Either`. |
| Répartir toutes les informations du contrat entre résultats voulus et non voulus | `iSelectExpectedResponseByInformation` ; sélecteur exhaustif `true` / `false`, résultat sous `Either` |
| Discriminer les `Right` par l'information de la réponse | `toEitherByInformation` ; sélecteur exhaustif, `Right<Information, Réponse>` pour les entrées `true` |
| Discriminer les `Right` par le code HTTP | `toEitherByCode` ; sélecteur exhaustif, `Right<"response-<code>", Réponse>` pour les entrées `true` |

Les sélecteurs exigent une décision pour chaque information ou code déclaré dans les réponses de la requête. Une évolution du contrat impose ainsi de revoir ce choix. `false` conserve la réponse dans un `Left<"unexpect-response", ...>` ; les erreurs de requête restent des `Left<"request-error", ...>`. Les `Left` ne prennent pas le nom de l'information ou du code rejeté. Traiter ces branches avec les outils `Either` ; une réponse non voulue n'est pas supprimée silencieusement. Les variantes `OrThrow` lèvent une erreur pour ces branches, y compris les erreurs de requête.

La famille `ExpectedResponse` sans sélecteur (`whenExpectedResponse`, `iWantExpectedResponse`) regroupe les codes `2xx` et `4xx`. Elle ne signifie pas « tous les codes déclarés dans le contrat » et ne remplace pas le choix des cas utiles à l'application. Pour un scénario précis, sélectionner l'information attendue, ou le code si l'API ne fournit pas d'information.

## Réponses prévues et mode Predicted

Une réponse **prévue** appartient aux réponses contractuelles de l'API. Elle peut être un succès ou une erreur métier, par exemple un `404` déclaré. Une réponse **voulue** est celle que le consommateur décide d'accepter à cet endroit du programme. Une réponse prévue peut donc être rejetée par un sélecteur.

Le serveur DuploJS ajoute le header `predicted` aux `PredictedResponse` et à leurs équivalents SSE et stream. Ce marqueur permet au client de reconnaître les réponses prévues par l'API. Une erreur de parsing du body ou une erreur interne peut produire une réponse imprévue. Son code ou son information peut coïncider avec celui d'une réponse prévue, sans garantir le même body.

Par défaut, `disabledPredictedMode` vaut `false`. Le client vérifie la **présence** du header indiqué par `predictedHeaderKey` (`predicted` par défaut). Sans ce header, les hooks ciblés par information, code ou famille ne s'exécutent pas et les attentes et sélecteurs renvoient `Left<"unexpect-response", ...>`, même si le code ou l'information correspond. Cela évite d'utiliser sous un type contractuel le contenu d'une autre réponse. Les hooks généraux de réponse et le hook dédié aux réponses imprévues restent disponibles.

Cette règle concerne les attentes : un `await` direct sur la `PromiseRequest`, sans sélection, conserve une réponse HTTP reçue dans un `Right<"response", ...>`, y compris sans marqueur. Utiliser une attente pour obtenir la réponse correspondant au besoin ; ne pas confondre réception d'une réponse et acceptation de son contrat.

## Adapter le client au protocole du fournisseur

Pour une API **sans ce marqueur**, créer son client avec `disabledPredictedMode: true`. Les attentes se fondent alors sur le code ou l'information sans imposer le header. Sans information de réponse, sélectionner par code. Si seuls les noms des headers diffèrent, configurer `predictedHeaderKey` et `informationHeaderKey` selon le protocole de l'API. Conserver le mode actif pour une API DuploJS qui fournit le marqueur.

Le marqueur est une convention du protocole, pas une validation du contenu ni une preuve d'authenticité. Le body reste à valider lorsque le traitement exige une garantie runtime.

## Particularité d'inférence d'un contrat sans information

Avec l'API actuelle, un contrat de réponses sans header d'information doit déclarer explicitement `information?: undefined` dans chaque réponse pour conserver leur inférence. L'[exemple d'API externe](examples/external-client.ts) applique cette forme et sélectionne par code. Cette déclaration répond au typage de l'API cliente ; elle n'ajoute aucun header au protocole.

