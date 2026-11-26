### Steps de route

Composer les traitements d'une route, propager les données du floor et produire une réponse.

---

Les steps sont ajoutées au builder dans l'ordre de leur déclaration et exécutées dans cet ordre. Le floor initial d'une route ordinaire est vide ; un preflight peut ajouter des steps avant celles de la route. Chaque callback reçoit le floor disponible à son emplacement. Une extraction, un cut ou une vérification peut l'enrichir : TypeScript rend alors les nouvelles propriétés accessibles aux steps suivantes. Une step peut aussi poursuivre sans ajouter de propriété. Les nouvelles propriétés remplacent celles de même nom.

Une réponse produite pendant une step interrompt le flux courant ; le handler final produit la réponse si les steps précédentes ont poursuivi. Les hooks encadrent également l'exécution.

```text
floor initial → extract → floor enrichi → cut → floor enrichi ou réponse → handler → réponse
```

### [RouteBuilder.check et RouteBuilder.presetCheck](10-check.ts)

Intégrer une vérification réutilisable au flux d'une route.
 
### [RouteBuilder.cut](10-cut.ts)

Poursuivre une route avec des données supplémentaires ou répondre immédiatement.
 
### [RouteBuilder.exec](10-exec.ts)

Exécuter un process réutilisable dans une route.
 
### [RouteBuilder.extract](10-extract.ts)

Valider les sources de la requête et ajouter leurs valeurs au floor.
 
### [RouteBuilder.handler](10-handler.ts)

Terminer la construction d'une route par une réponse HTTP.
 
