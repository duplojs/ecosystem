## Route

Déclaration des routes HTTP, composition de leurs steps et configuration de la lecture du body.

### Builder

Déclarer et configurer une route.

#### [useRouteBuilder](10-builder/10-useRouteBuilder.ts)

Déclarer la méthode, les chemins et les options d'une route HTTP.
 
### [Steps](20-steps/index.md)

Composer les traitements d'une route, propager les données du floor et produire une réponse.


#### [RouteBuilder.check et RouteBuilder.presetCheck](20-steps/10-check.ts)

Intégrer une vérification réutilisable au flux d'une route.
 
#### [RouteBuilder.cut](20-steps/10-cut.ts)

Poursuivre une route avec des données supplémentaires ou répondre immédiatement.
 
#### [RouteBuilder.exec](20-steps/10-exec.ts)

Exécuter un process réutilisable dans une route.
 
#### [RouteBuilder.extract](20-steps/10-extract.ts)

Valider les sources de la requête et ajouter leurs valeurs au floor.
 
#### [RouteBuilder.handler](20-steps/10-handler.ts)

Terminer la construction d'une route par une réponse HTTP.
 
### Body

Choisir le contrôleur de lecture du body et configurer les limites utiles à son extraction.

#### [controlBodyAsEmpty](30-body/10-controlBodyAsEmpty.ts)

Sélectionner un body vide pour une route.
 
#### [controlBodyAsFormData](30-body/10-controlBodyAsFormData.ts)

Lire un body multipart avec des limites adaptées aux champs et fichiers.
 
#### [controlBodyAsText](30-body/10-controlBodyAsText.ts)

Sélectionner le lecteur de body textuel et sa limite de taille.
 
