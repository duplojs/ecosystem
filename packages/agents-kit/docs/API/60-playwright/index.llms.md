# @duplojs/playwright

Fabriques de site, pages et composants, interactions et assertions pour les parcours E2E.

### [createComponent](10-createComponent.ts)

Définir une zone réutilisable et ses éléments, méthodes et composants enfants.
 
### [createComponentInteraction](10-createComponentInteraction.ts)

Créer une interaction typée sur un élément nommé et une étape Playwright.
 
### [createPage](10-createPage.ts)

Définir un écran navigable et son chemin typé.
 
### [createStepWrapper](10-createStepWrapper.ts)

Envelopper des interactions dans une étape Playwright personnalisée.
 
### [createWebsite](10-createWebsite.ts)

Construire le contexte du site et naviguer ou vérifier ses pages et composants.
 
# Actions

Interactions avec les éléments nommés des pages et composants.

### [Actions.check](10-actions/10-check.ts)

Cocher un élément visible.
 
### [Actions.clear](10-actions/10-clear.ts)

Effacer un champ visible.
 
### [Actions.click](10-actions/10-click.ts)

Cliquer sur un élément visible.
 
### [Actions.dragTo](10-actions/10-dragTo.ts)

Glisser un élément visible vers une cible visible.
 
### [Actions.extractContent](10-actions/10-extractContent.ts)

Extraire le contenu textuel d’un élément visible.
 
### [Actions.fill](10-actions/10-fill.ts)

Remplacer la valeur d’un champ visible.
 
### [Actions.focus](10-actions/10-focus.ts)

Donner le focus à un élément visible.
 
### [Actions.forceClick](10-actions/10-forceClick.ts)

Forcer le clic sans contrôle préalable de visibilité.
 
### [Actions.hover](10-actions/10-hover.ts)

Survoler un élément visible.
 
### [Actions.press](10-actions/10-press.ts)

Appuyer sur une touche dans un élément visible.
 
### [Actions.selectOption](10-actions/10-selectOption.ts)

Sélectionner des options et retourner leurs valeurs.
 
### [Actions.type](10-actions/10-type.ts)

Saisir le texte caractère par caractère dans un élément visible.
 
### [Actions.uncheck](10-actions/10-uncheck.ts)

Décocher un élément visible.
 
### [Actions.withStep](10-actions/10-withStep.ts)

Ajouter une étape Playwright nommée autour d’une interaction.
 
# Assertions

Vérifications de l’état des éléments nommés des pages et composants.

### [Assertions.toBeBusy](10-assertions/10-toBeBusy.ts)

Vérifier aria-busy="true" sur un élément visible.
 
### [Assertions.toBeChecked](10-assertions/10-toBeChecked.ts)

Vérifier qu’un élément visible est coché.
 
### [Assertions.toBeDisabled](10-assertions/10-toBeDisabled.ts)

Vérifier qu’un élément visible est désactivé.
 
### [Assertions.toBeEnabled](10-assertions/10-toBeEnabled.ts)

Vérifier qu’un élément visible est activé.
 
### [Assertions.toBeHidden](10-assertions/10-toBeHidden.ts)

Vérifier que l’élément est caché.
 
### [Assertions.toBeNotBusy](10-assertions/10-toBeNotBusy.ts)

Vérifier aria-busy="false" sur un élément visible.
 
### [Assertions.toBeVisible](10-assertions/10-toBeVisible.ts)

Faire défiler jusqu’à l’élément puis vérifier sa visibilité.
 
### [Assertions.toContainText](10-assertions/10-toContainText.ts)

Vérifier une partie du texte d’un élément visible.
 
### [Assertions.toHaveAttribute](10-assertions/10-toHaveAttribute.ts)

Vérifier un attribut d’un élément visible.
 
### [Assertions.toHaveClass](10-assertions/10-toHaveClass.ts)

Vérifier les classes d’un élément visible.
 
### [Assertions.toHaveNoText](10-assertions/10-toHaveNoText.ts)

Vérifier que le texte d’un élément visible est vide.
 
### [Assertions.toHaveQuantity](10-assertions/10-toHaveQuantity.ts)

Vérifier le nombre d’éléments correspondants.
 
### [Assertions.toHaveText](10-assertions/10-toHaveText.ts)

Vérifier le texte complet d’un élément visible.
 
### [Assertions.toHaveValue](10-assertions/10-toHaveValue.ts)

Vérifier la valeur d’un élément visible.
 
### [Assertions.withStep](10-assertions/10-withStep.ts)

Ajouter une étape Playwright nommée autour d’une interaction.
 
