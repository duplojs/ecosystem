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

## [DInvocation](API/10-lang/10-invocation/index.llms.md)

Primitives pour composer des traitements, orchestrer des workflows, exprimer leurs contrats et représenter la provenance des valeurs.

## [DModeling](API/10-lang/10-modeling/index.llms.md)

Construire des types métier, des entités, des objets tagués et les preuves de leurs transitions ou de leur état.

## [DNumber](API/10-lang/10-number/index.llms.md)

Prédicats et transformations fonctionnelles pour comparer, vérifier, agréger et trier des nombres tout en conservant leurs contraintes de typage.

## [DObject](API/10-lang/10-object/index.llms.md)

Fonctions fonctionnelles pour lire, discriminer, transformer, fusionner et reconstruire des objets en conservant les informations de typage utiles.

## [DPath](API/10-lang/10-path/index.llms.md)

Chemins Unix typés : déclarer des littéraux, valider et normaliser des chaînes runtime, extraire des segments, résoudre des chemins ou sélectionner des motifs glob, indépendamment du système de fichiers.

## [DPattern](API/10-lang/10-pattern/index.llms.md)

Sélectionner et traiter les variantes d’une union par identité, valeur littérale, motif structurel ou predicate, avec couverture exhaustive ou branche de repli.

## [DPrinter](API/10-lang/10-printer/index.llms.md)

Fonctions et constantes pour assembler du texte, formater des lignes et paragraphes, ajouter une indentation ou des styles ANSI.

## [DString](API/10-lang/10-string/index.llms.md)

Fonctions de manipulation, recherche, validation et transformation des chaînes de caractères, avec des formes curifiées et des contraintes de typage lorsque l'API peut les établir.

## [DTuple](API/10-lang/10-tuple/index.llms.md)

Manipulation et typage des tuples : convertir les garanties de cardinalité en positions typées, puis transformer leurs éléments en conservant leur forme.

# @duplojs/server

Capacités portables de fichiers, environnement, validation de ressources et commandes CLI.

## [DSFile](API/20-server/10-file/index.llms.md)

Lire et modifier les ressources du système de fichiers, leurs chemins et leurs métadonnées.

## [DSCommon](API/20-server/20-common/index.llms.md)

Accéder à la configuration, aux arguments et aux capacités du processus.

## [DSDataStructure](API/20-server/30-dataStructure/index.llms.md)

Décoder et valider les interfaces de fichiers et dossiers avec les contraintes serveur.

## [DSCommand](API/20-server/40-command/index.llms.md)

Déclarer et exécuter des commandes CLI et leurs entrées typées.

## [Path](API/20-server/50-path/index.llms.md)

Normaliser les chemins issus de la plateforme et convertir les chemins DuploJS pour les API système.

# @duplojs/http

Construire une application HTTP avec des routes, des vérifications réutilisables et des process. Les preflights préparent des routes communes et les hooks interviennent dans leur cycle de vie. Le package fournit aussi un client typé, des connecteurs pour les plateformes et des plugins complémentaires.

## [Hub](API/30-http/10-hub/index.llms.md)

Création et configuration du Hub qui assemble les routes, les plugins et les hooks d'une application HTTP avant son démarrage par un connecteur.

## Route

Déclaration des routes HTTP, composition de leurs steps et configuration de la lecture du body.

### [Builder de route](API/30-http/20-route/10-builder/index.llms.md)

Déclarer une méthode et des chemins, configurer une route et finaliser sa construction.

### [Steps de route](API/30-http/20-route/20-steps/index.llms.md)

Composer les traitements d'une route, propager les données du floor et produire une réponse.

### [Body des routes](API/30-http/20-route/30-body/index.llms.md)

Choisir le contrôleur de lecture du body et configurer les limites utiles à son extraction.

## [Checker](API/30-http/30-checker/index.llms.md)

Créer des checkers aux résultats identifiés, les utiliser dans un flux HTTP et partager leur interprétation avec un preset.

## [Process](API/30-http/40-process/index.llms.md)

Créer et composer des séquences réutilisables de steps, configurables par options, et exporter leurs données vers une route ou un autre process.

## [Preflight](API/30-http/50-preflight/index.llms.md)

Préparer des builders de routes réutilisables avec des process, leurs données importées et des configurations communes de hooks et metadata.

# [Hooks HTTP](API/30-http/60-hooks/index.llms.md)

Les hooks du Hub interviennent dans la construction et le cycle de vie du serveur ; les hooks de route accompagnent le traitement d'une requête et de sa réponse.

# Client HTTP

Construire un client HTTP, configurer ses requêtes et traiter leurs réponses, flux et cache.

# [Construction du client HTTP](API/30-http/70-client/10-construction/index.llms.md)

Créer un client avec ou sans contrat et déduire un contrat des routes HTTP.

# [Requêtes du client HTTP](API/30-http/70-client/20-request/index.llms.md)

Construire les requêtes, leurs paramètres et leurs headers par défaut.

# [Réponses du client HTTP](API/30-http/70-client/30-response/index.llms.md)

Observer, sélectionner et traiter les réponses et les erreurs de requête.

# [Hooks du client HTTP](API/30-http/70-client/40-hooks/index.llms.md)

Configurer les traitements communs et les intercepteurs locaux aux requêtes.

# [Flux du client HTTP](API/30-http/70-client/50-streaming/index.llms.md)

Consommer les événements SSE et les flux de données.

# [Cache du client HTTP](API/30-http/70-client/60-cache/index.llms.md)

Configurer les clés et contrôler le cache applicatif du client.

# Connecteurs HTTP

Démarrer une application HTTP sur une plateforme avec le connecteur adapté.

# [Connecteur Node](API/30-http/80-connectors/10-node/index.llms.md)

Exécuter une application DuploJS HTTP avec un serveur HTTP ou HTTPS Node.js, à partir d'un Hub et d'une configuration propre au serveur.

# Plugins HTTP

Générer des contrats, ajouter des fonctionnalités HTTP et créer des plugins pour le Hub.

# [CodeGenerator](API/30-http/90-plugins/10-code-generator/index.llms.md)

Générer les types des routes pour un client HTTP et partager des modules avec Rolldown.

# [CORS](API/30-http/90-plugins/20-cors/index.llms.md)

Configurer les réponses CORS et les requêtes de préflight.

# [Cookies](API/30-http/90-plugins/30-cookie/index.llms.md)

Lire et écrire les cookies dans les routes HTTP.

# [OpenAPI](API/30-http/90-plugins/40-open-api/index.llms.md)

Produire une description OpenAPI et une interface Swagger.

# [Fichiers statiques](API/30-http/90-plugins/50-static/index.llms.md)

Exposer un fichier ou un dossier par HTTP.

# [Cache-Control](API/30-http/90-plugins/60-cache-controller/index.llms.md)

Ajouter des directives de cache aux réponses éligibles.

# [Créer un plugin](API/30-http/90-plugins/70-create-plugin/index.llms.md)

Assembler des routes et des hooks dans un plugin de Hub.

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
