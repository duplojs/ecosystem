# Référence API

Références des fonctions publiques de l’écosystème DuploJS, organisées par package, namespace et domaine.

# @duplojs/lang

Primitives fonctionnelles indépendantes de la plateforme pour composer des transformations, manipuler les données et préserver leurs garanties de typage.

## [DArray](API/10-lang/10-array/index.llms.md)

Opérations immuables de lecture, transformation, sélection, réduction et modification de tableaux, avec prise en compte de leurs contraintes de typage.

## [DChrono](API/10-lang/10-chrono/index.llms.md)

Création, calcul, comparaison, sérialisation et formatage des dates, heures, durées et fuseaux horaires dans les représentations Chrono de DuploJS.

## [DCommon](API/10-lang/10-common/index.llms.md)

Fonctions générales de composition, de transformation, de contrôle de flux et de manipulation des valeurs partagées par les autres domaines DuploJS.

## [DDataStructure](API/10-lang/10-dataStructure/index.llms.md)

Construction de contrats de données validables au runtime, composables et reflétés dans les types TypeScript.

## [DEither](API/10-lang/10-either/index.llms.md)

Création, discrimination, transformation et propagation des réussites ou des échecs représentés par `Either`.

## [DGenerator](API/10-lang/10-generator/index.llms.md)

Création et composition de génératrices synchrones ou asynchrones pour produire, transformer, filtrer, réduire et consommer des séquences de valeurs.

## [DNumber](API/10-lang/10-number/index.llms.md)

Prédicats et transformations fonctionnelles pour comparer, vérifier, agréger et trier des nombres tout en conservant leurs contraintes de typage.

## [DObject](API/10-lang/10-object/index.llms.md)

Fonctions fonctionnelles pour lire, discriminer, transformer, fusionner et reconstruire des objets en conservant les informations de typage utiles.

# [DPath](API/10-lang/10-path/index.llms.md)

Le domaine `DPath` représente des chemins avec des contraintes de type, les normalise, les assemble et vérifie leurs segments. Ses fabriques valident les chaînes runtime avant de produire un chemin typé.

# [DPrinter](API/10-lang/10-printer/index.llms.md)

Fonctions et constantes pour assembler du texte, formater des lignes et paragraphes, ajouter une indentation ou des styles ANSI.

## [DString](API/10-lang/10-string/index.llms.md)

Fonctions de manipulation, recherche, validation et transformation des chaînes de caractères, avec des formes curifiées et des contraintes de typage lorsque l'API peut les établir.

# @duplojs/json-web-token

Politiques JWT réutilisables, signature, chiffrement facultatif et primitives cryptographiques.

## [TokenHandler](API/40-json-web-token/10-tokenHandler/index.llms.md)

Définir une politique et créer, décoder ou vérifier les tokens associés.

## [Signer](API/40-json-web-token/20-signer/index.llms.md)

Configurer la signature et la vérification cryptographiques.

## [Cipher](API/40-json-web-token/30-cipher/index.llms.md)

Configurer le chiffrement et le déchiffrement facultatifs des tokens.

## [Utilitaires JWT](API/40-json-web-token/40-utils/index.llms.md)

Manipuler les encodages et les primitives cryptographiques publiques.

# @duplojs/form

Construction de formulaires typés à partir de champs composables et de leurs validations.

## Form pour Vue

Fabriques de formulaires, de champs et de templates pour l'intégration Vue.

### [Construction de formulaires](API/50-form/10-vue/10-construction/index.llms.md)

Fabriques de formulaires, de champs et de templates.

### [Layouts](API/50-form/10-vue/20-layouts/index.llms.md)

Composition des champs et ajout de structure, validation, contrôle de flux et slots.

### [Design system](API/50-form/10-vue/30-designSystem/index.llms.md)

Composants et inputs prêts à l'emploi pour construire les formulaires et les commandes des templates Grid.

# @duplojs/playwright

Fabriques de site, pages et composants, interactions et assertions pour les parcours E2E.

## [Construction](API/60-playwright/10-construction/index.llms.md)

Fabriques de sites, pages, composants, interactions et wrappers de parcours.

## [Actions](API/60-playwright/20-actions/index.llms.md)

Interactions avec les éléments nommés des pages et composants.

## [Assertions](API/60-playwright/30-assertions/index.llms.md)

Vérifications de l’état des éléments nommés des pages et composants.
