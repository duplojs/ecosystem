## Hub

Création et configuration du Hub qui assemble les routes, les plugins et les hooks d'une application HTTP avant son démarrage par un connecteur.

### [Hub.addHubHooks](10-addHubHooks.ts)

Enregistrer des hooks du cycle de vie global du Hub et du serveur.
 
### [Hub.addRouteHooks](10-addRouteHooks.ts)

Enregistrer des hooks globaux pour les phases de traitement des routes.
 
### [createHub](10-createHub.ts)

Créer le Hub qui rassemble les routes et configure une application HTTP.
 
### [Hub.plug](10-plug.ts)

Installer un plugin et intégrer les capacités qu'il apporte au Hub.
 
### [Hub.register](10-register.ts)

Enregistrer une route, un itérable ou les valeurs d'un objet de routes.
 
### [routeStore](10-routeStore.ts)

Récupérer les routes déclarées pour les enregistrer dans un Hub.
 
### [Hub.setDefaultBodyController](10-setDefaultBodyController.ts)

Choisir le contrôleur de lecture du body utilisé par défaut pour les routes.
 
### [Hub.setDefaultExtractOtherwise](10-setDefaultExtractOtherwise.ts)

Configurer la réponse par défaut lorsqu'une extraction échoue.
 
### [Hub.setDefaultExtractShapeCodecs](10-setDefaultExtractShapeCodecs.ts)

Configurer les codecs utilisés pour valider les sources d'extraction hors body.
 
### [Hub.setMalformedUrlHandler](10-setMalformedUrlHandler.ts)

Personnaliser la réponse lorsque l'URL de la requête est malformée.
 
### [Hub.setNotfoundHandler](10-setNotfoundHandler.ts)

Personnaliser la réponse lorsqu'aucune route ne correspond à la requête.
 
