## Plugins

Générer des contrats, ajouter des fonctionnalités HTTP et créer des plugins pour le Hub.

### [CodeGenerator](10-code-generator/index.md)

Générer les types des routes pour un client HTTP et partager des modules avec Rolldown.


#### [generateRoutesTypesRolldown](10-code-generator/10-generateRoutesTypesRolldown.ts)

Générer les types des routes pour les utiliser dans un client HTTP.
 
#### [generateSlicesRolldown](10-code-generator/10-generateSlicesRolldown.ts)

Construire des modules partagés à partir de fichiers TypeScript sélectionnés.
 
#### [Consommer les contrats générés](10-code-generator/10-useGeneratedContracts.ts)

Utiliser les types de routes générés pour créer un client HTTP.
 
### CORS

Configurer les réponses CORS et les requêtes de préflight.

#### [corsPlugin](20-cors/10-corsPlugin.ts)

Configurer les headers CORS et les réponses aux requêtes OPTIONS.
 
### Cookies

Manipuler les cookies des requêtes et réponses.

#### [cookiePlugin](30-cookie/10-cookiePlugin.ts)

Lire, valider, écrire et supprimer des cookies dans les routes.
 
### OpenAPI

Produire une description OpenAPI et une interface Swagger.

#### [openApiGeneratorPlugin](40-open-api/10-openApiGeneratorPlugin.ts)

Générer une documentation OpenAPI à partir des routes.
 
### Fichiers statiques

Servir des ressources statiques.

#### [staticPlugin](50-static/10-staticPlugin.ts)

Exposer un fichier ou un dossier sous des chemins HTTP.
 
### Cache-Control

Ajouter des directives de cache aux réponses éligibles.

#### [createCacheControllerHooks](60-cache-controller/10-createCacheControllerHooks.ts)

Ajouter le header Cache-Control aux réponses HTTP.
 
### Créer un plugin

Assembler des routes et des hooks dans un plugin de Hub.

#### [HubPlugin](70-create-plugin/10-createPlugin.ts)

Créer un plugin configurable composé de routes et de hooks.
 
