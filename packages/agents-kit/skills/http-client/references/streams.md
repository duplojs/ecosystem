# Consommer progressivement un flux

Décrire les événements SSE avec `responses.events` et les données d'un stream avec `responses.flux`. Après sélection de la réponse, consommer l'itérateur asynchrone pour traiter les éléments au fur et à mesure, ou enregistrer les callbacks puis lancer la consommation. Voir [SSE et stream](examples/client-streams.ts).

- **SSE** : `onReceiveEvent` cible un événement typé, `onStreamEvent` observe le cycle, `consumeEventStream` lance la lecture et `closeEventStream` ferme le flux. La réponse est reconnue par le content-type `text/event-stream`.
- **Stream** : `onStream` observe notamment `receiveData`, `consumeStream` lance la lecture et `closeStream` ferme le flux. Cette couche est activée par le header `x-duplojs-body-options` contenant `stream` ; les chunks sont décodés en texte si le content-type contient `text`, sinon ils restent des `Uint8Array`. Les chunks ne sont pas nécessairement des messages applicatifs complets : gérer le découpage si le protocole l'exige.

`whenReceiveServerEvent` et `whenReceiveDataStream` permettent aussi d'attacher les callbacks depuis la `PromiseRequest` ; ils ne lancent pas à eux seuls la consommation. Les hooks globaux du client peuvent instrumenter le démarrage, la réception, les erreurs et la fermeture. Le mode de réponses prévues s'applique également à ces réponses : le désactiver pour un fournisseur sans marqueur. Le typage seul ne transforme pas un flux arbitraire en SSE ou en stream reconnu par cette couche ; vérifier les headers et le format de l'API.

Pour choisir la réponse avant sa consommation, consulter [les attentes et le mode Predicted](responses.md).
