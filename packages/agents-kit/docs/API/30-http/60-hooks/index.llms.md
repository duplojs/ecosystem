## Hooks

Les hooks du Hub interviennent dans la construction et le cycle de vie du serveur ; les hooks de route accompagnent le traitement d'une requête et de sa réponse.

### [createHookHubLifeCycle](10-createHookHubLifeCycle.ts)

Définir beforeBuildRoute, beforeServerBuildRoutes, beforeStartServer, afterStartServer et serverError.
 
### [createHookRouteLifeCycle](10-createHookRouteLifeCycle.ts)

Définir beforeRouteExecution, error, beforeSendResponse, sendResponse et afterSendResponse.
 
### [Portée et ordre des hooks de route](10-hookScope.ts)

Associer les hooks aux routes et comprendre leur composition.
 
