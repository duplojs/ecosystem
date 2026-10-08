## Duplojs ecosystem

L'écosystème DuploJS a pour but de compenser les manquements de TypeScript grâce à la puissance des génériques de celui-ci. Les features fondatrices sont surtout là pour améliorer la modélisation de la donnée et également pour la manipuler.

Le principe d'un logiciel c'est de gérer de la donnée. Donc il faut particulièrement faire attention à ses structures, â ses états et â ses transitions des données qui constitueront leurs cycle de vie. DuploJS a pour vocation de vouloir améliorés et standardiser la modélisation de tout ça afin de créer des logiciels robustes et scalables.
## Contraintes de typage

Garanties sur les valeurs : acquisition, composition, propagation, compatibilité statique et contraintes personnalisées.


### Acquisition des contraintes.

Vérification runtime et narrowing vers un type contraint.
 

```ts
import * as DNumber from "@duplojs/lang/number";

// Une contrainte existe uniquement dans le typage : elle ne modifie ni ne valide la valeur.
// L’intersection compose ici deux garanties établies par les predicates.
type Age = number & DNumber.Integer & DNumber.Positive;

// @ts-expect-error Le littéral seul ne porte pas les contraintes attendues.
const age: Age = 12;

// Chaque vérification réussie enrichit le type sans changer la valeur runtime.
const maybeAge = 12;
if (
	DNumber.isInteger(maybeAge)
	&& DNumber.isPositive(maybeAge)
) {
	const age: Age = maybeAge;
}
```

### [Composition des contraintes fournies.](ai-docs/src/01-fundamental/01-constraint/10-built-in-constraint.ts)

Réutilisation et composition des contraintes disponibles dans les domaines.
 

### [Manipulation des valeurs contraintes.](ai-docs/src/01-fundamental/01-constraint/20-manipulation.ts)

Exploitation des contraintes par les fonctions DuploJS pour simplifier la manipulation des valeurs.
 

### [Compatibilité statique des contraintes.](ai-docs/src/01-fundamental/01-constraint/30-cast.ts)

Cast par implication, valeurs littérales et inférence en contexte générique.
 

### [Contraintes personnalisées.](ai-docs/src/01-fundamental/01-constraint/40-custom-constraint.ts)

Déclaration, predicate de validation et extension des règles de cast.
 
## Currification

Composition des transformations de données avec les fonctions DuploJS : pipes, callbacks et traitements asynchrones.


### Currification et composition avec pipe.

Configurer les opérations avant de recevoir la donnée et enchaîner ses transformations.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// La forme curifiée reçoit les paramètres, puis la donnée transmise par pipe.
// Privilégier pipe dès qu’une donnée subit plusieurs transformations,
// ou si le traitement est susceptible d’en accueillir d’autres.
// Utiliser en priorité les fonctions fournies par l’écosystème.
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	// Configure le séparateur ; pipe fournit ensuite la chaîne.
	DString.split(","),
	// Configure la transformation ; pipe fournit le tableau.
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);
// Résultat : ["typescript", "duplojs", "functional"].
// Chaque étape reçoit la sortie précédente ; les types suivent ces transformations.
// On peut ajouter, retirer ou réordonner les étapes sans restructurer le traitement.
```

### [Réutilisation des fonctions de l’écosystème dans les pipes.](ai-docs/src/01-fundamental/02-currying/10-built-in-function.ts)

Composer les opérations fournies, sous forme curifiée ou directement compatible avec pipe.
 

### [Composition dans une callback.](ai-docs/src/01-fundamental/02-currying/20-inner-pipe.ts)

Enchaîner des transformations lorsque la fonction appelante attend une fonction.
 

### [Composition de traitements asynchrones.](ai-docs/src/01-fundamental/02-currying/30-async-pipe.ts)

Enchaîner des étapes synchrones et asynchrones dans un pipe ou une callback.
 
## Either

Résultats et états contextualisés : représentation, discrimination, traitement exhaustif, propagation des échecs et adaptation des contrats.


### Représentation des résultats avec Either.

Statuts Right et Left, information contextuelle et valeur associée.
 

```ts
import * as DEither from "@duplojs/lang/either";

// Un résultat porte un statut, une information qui identifie le cas et une valeur.
const result = DEither.right("user-found", { name: "Alice" });
const missing = DEither.left("user-not-found");

// Les variantes fournies reposent sur Right (Success, Some, Result, Ok) ou Left
// (Fail, Error, None).
// Result décrit un état contextualisé sans décider s’il constitue un succès ou un échec.
// Un contrat exprime les résultats possibles par une union, avec des informations
// personnalisées ou des variantes fournies.
type FindUserResult = DEither.Right<"user-found", { name: "Alice" }> | DEither.Left<"user-not-found", undefined>;
```

### [Discrimination et extraction des résultats.](ai-docs/src/01-fundamental/03-either/10-discrimination.ts)

Choisir une branche par statut ou information, extraire sa valeur et traiter les autres cas.
 

### [Décisions exhaustives sur les résultats.](ai-docs/src/01-fundamental/03-either/20-exhaustive-handling.ts)

Sélection et traitement de chaque variante pour détecter les évolutions du contrat.
 

### [Composition avec propagation des échecs.](ai-docs/src/01-fundamental/03-either/30-composition.ts)

Enchaîner ou regrouper des opérations en arrêtant le traitement au premier Left.
 

### [Adaptation des résultats au contexte.](ai-docs/src/01-fundamental/03-either/40-result-adaptation.ts)

Reclasser les statuts et renommer les informations en conservant les valeurs.
 

### [Conversion des absences et exceptions en résultats.](ai-docs/src/01-fundamental/03-either/50-external-results.ts)

Intégrer des valeurs optionnelles ou des appels pouvant échouer dans un contrat Either.
 

### [États contextualisés avec Result.](ai-docs/src/01-fundamental/03-either/60-contextual-state.ts)

Décrire et discriminer des états sans leur attribuer un sens de succès ou d’échec.
 
## DataStructure

Contrats de données partagés entre TypeScript et runtime : composition, validation, contraintes, représentations, récursivité et erreurs.


### Contrats de données avec DataStructure.

Décrire les données attendues et obtenir des valeurs typées après validation.
 

```ts
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Une structure porte le même contrat dans TypeScript et au runtime.
// L’utiliser aux frontières du logiciel pour vérifier les données encore inconnues.
const userStructure = DDataStructure.object({
	name: DDataStructure.string(),
	email: DDataStructure.string([DDataStructure.email()]),
});
type User = DDataStructure.StructureValue<typeof userStructure>;

declare const input: unknown;
const result = userStructure.check(input);
if (DEither.isRight(result)) {
	const user: User = DEither.unwrapRight(result);
}
// Un Left conserve une erreur structurée lorsque la validation échoue.
```

### [Composition des contrats de données.](ai-docs/src/01-fundamental/04-data-structure/10-structure.ts)

Construire et réutiliser des structures pour décrire des données simples ou composées.
 

### [Contraintes de validation dans les structures.](ai-docs/src/01-fundamental/04-data-structure/20-constraint.ts)

Ajouter et cumuler des contraintes compatibles, fournies ou personnalisées.
 

### [Validation des données entrantes.](ai-docs/src/01-fundamental/04-data-structure/30-validation.ts)

Vérification, conversion et narrowing aux frontières du logiciel, en synchrone ou asynchrone.
 

### [Changement de représentation avec des codecs.](ai-docs/src/01-fundamental/04-data-structure/40-codecs.ts)

Encoder et décoder les données avec un même contrat, selon leur type fondamental.
 

### [Contrats de données récursifs.](ai-docs/src/01-fundamental/04-data-structure/50-recursive.ts)

Références différées et cohérence entre un type déclaré et sa structure runtime.
 

### [Interprétation des erreurs de validation et de conversion.](ai-docs/src/01-fundamental/04-data-structure/60-interpret-error.ts)

Localiser les données invalides et adapter les messages au contexte ou à la langue.
 
## Chrono

Représentation des instants et durées : création, calculs, comparaison, sérialisation et fuseaux horaires.


### Représentation des instants et des durées.

TheDate et TheTime pour modéliser le temps avec des valeurs immuables.
 

```ts
import * as DChrono from "@duplojs/lang/chrono";

// TheDate représente un instant absolu ; TheTime une durée ou une quantité de temps.
// Privilégier ces types aux Date et number natifs dans le domaine pour rendre ce sens explicite.
const instant = DChrono.createDate("2026-09-30");
const duration = DChrono.createTime(2, "hour");

// La transformation produit un nouvel instant ; la valeur initiale reste inchangée.
const later = DChrono.addTime(instant, duration);
```

### [Création des instants et des durées.](ai-docs/src/01-fundamental/05-chrono/10-creation.ts)

Valeurs connues statiquement ou reçues au runtime, et gestion des entrées invalides.
 

### [Calculs et comparaisons temporels.](ai-docs/src/01-fundamental/05-chrono/20-manipulation.ts)

Transformer, comparer et décomposer des instants ou durées avec les fonctions Chrono.
 

### [Transport et reconstruction des valeurs temporelles.](ai-docs/src/01-fundamental/05-chrono/30-serialized.ts)

Sérialiser, reconnaître et reconstruire les instants et durées en conservant leur valeur.
 

### [Interprétation et affichage dans un fuseau horaire.](ai-docs/src/01-fundamental/05-chrono/40-timezone.ts)

Interpréter une heure locale et lire ou présenter un instant dans le fuseau demandé.
 
## Modélisation

Identités métier, modèles de données, états et transitions, preuves de passage et identité des opérations dans les contrats.


### [Identité et contraintes des types métier.](ai-docs/src/01-fundamental/06-modeling/10-new-type.ts)

Distinguer des valeurs de même représentation par des NewType propres à leur rôle métier.
 

### [Entités métier et hydratation.](ai-docs/src/01-fundamental/06-modeling/20-entity.ts)

Déclarer les propriétés métier, hydrater les données externes et mettre à jour les valeurs typées.
 

### [Objets taggés et unions discriminées.](ai-docs/src/01-fundamental/06-modeling/30-tagged-object.ts)

Identité transportable, distinction des formes d’un objet et hydratation des données brutes.
 

### [Cycle de vie des entités.](ai-docs/src/01-fundamental/06-modeling/40-entity-lifecycle.ts)

États, préconditions et transitions métier représentés par des Flag et des Fact.
 

### [Preuves de passage par une opération.](ai-docs/src/01-fundamental/06-modeling/50-evidence.ts)

Exiger dans les types qu’une valeur soit passée par un traitement préalable.
 

### [Identité des fonctions dans les dépendances.](ai-docs/src/01-fundamental/06-modeling/60-signed-function.ts)

Exiger une fonction identifiée au-delà de sa seule signature TypeScript.
 
## Discrimination

Sélection et affinement des types dans les unions : identité, valeurs littérales, forme ou prédicats, traitement exhaustif ou partiel.


### [Discrimination des entités par identité.](ai-docs/src/01-fundamental/07-discrimination/10-entity.ts)

Sélection exhaustive ou partielle selon le nom métier, avec typage précis des branches.
 

### [Discrimination selon le fait courant.](ai-docs/src/01-fundamental/07-discrimination/20-fact.ts)

Choisir une branche selon la Fact portée par une valeur et accéder aux données du fait.
 

### [Discrimination des objets par tag.](ai-docs/src/01-fundamental/07-discrimination/30-tagged-object.ts)

Identifier la forme d’un objet par son tag et traiter tout ou partie de l’union.
 

### [Discrimination des valeurs littérales.](ai-docs/src/01-fundamental/07-discrimination/40-literal.ts)

Traitement exhaustif ou partiel d’une union selon la valeur, avec branches typées.
 

### [Discrimination par la forme des données.](ai-docs/src/01-fundamental/07-discrimination/50-shape.ts)

Sélectionner les variantes sans identité explicite par des patterns, y compris imbriqués.
 

### [Discrimination par prédicats et élimination.](ai-docs/src/01-fundamental/07-discrimination/60-predicate.ts)

Affiner les branches et réduire les cas restants, avec sélection positive ou inverse.
 
# Serveur

La partie serveur regroupe les abstractions qui relient une application
DuploJS à son environnement d'exécution.

Elle couvre les points de contact avec le runtime : interface HTTP, système de
fichiers, variables d'environnement, processus courant et commandes CLI. Le
code applicatif peut ainsi rester organisé autour de contrats typés, tandis que
les détails propres à Node.js, Deno ou Bun restent portés par les connecteurs
ou les implémentations de plateforme.

HTTP structure le flux exposé aux clients. Les autres domaines servent à
manipuler les ressources du runtime sans disperser ces dépendances dans le
reste de l'application.

# Manipuler des fichiers

Accès cross-platform au système de fichiers : chemins typés avec `Path`, opérations sur fichiers/dossiers/liens et erreurs représentées par `Either`.


### [Manipuler le système de fichiers](ai-docs/src/02-server/10-file/10-manipulation.ts)

Lecture, écriture et opérations de système de fichiers avec chemins typés et résultats `Either`.
 

### [Chemins typés](ai-docs/src/02-server/10-file/20-path.ts)

Contraintes `Path`, `Absolute` et `Segment` pour valider, extraire et résoudre des chemins Unix.
 
# HTTP

Une application HTTP DuploJS décrit l'interface par laquelle un domaine reçoit une requête, valide ses entrées, exécute un flux explicite et produit une réponse contextualisée.

Le `Hub` regroupe la configuration, les routes et les plugins de cette interface.

Une route n'est pas un objet métier : elle organise le passage entre protocole HTTP et logique applicative. Ses étapes valident les données de requête, partagent un contexte de traitement et déclarent les réponses que le flux peut produire.

Les routines déplacent les vérifications et séquences réutilisables hors des routes sans cacher les données qui entrent ou ressortent du flux.

La génération de code transforme ces déclarations en contrat statique partageable sans exposer la codebase serveur.


### [Créer une application HTTP](ai-docs/src/02-server/20-http/10-init.ts)

Configuration d'un `Hub`, plugins et enregistrement des routes d'une application HTTP.
 

### [Créer une route HTTP](ai-docs/src/02-server/20-http/20-route.ts)

Construction avec `useRouteBuilder` : steps, `floor`, extraction, réponse contextualisée et `handler`.
 

### [Faire une routine de vérification](ai-docs/src/02-server/20-http/30-routine.ts)

Vérifications locales ou réutilisables avec `cut`, `checker`, `presetCheck`, `process` et preflight.
 

### [Définir une politique de gestion de tokens](ai-docs/src/02-server/20-http/40-jwt.ts)

Déclaration d'une politique unique pour créer et vérifier une famille de tokens.
 

### [Comment partager des ressources](ai-docs/src/02-server/20-http/50-codegen.ts)

Génération du typage des routes et des `DataStructure` pour partager un contrat statique.
 
# Environnement

L'environnement regroupe ce que la plateforme d'exécution fournit à
l'application : système de fichiers, processus courant, dossier de travail,
variables d'environnement ou capacité à exposer une interface HTTP.

DuploJS évite de lier le code applicatif à l'API particulière de Node.js,
Deno ou Bun. Quand les plateformes partagent un modèle proche, le package
serveur expose une API commune. Quand l'intégration dépend davantage du
runtime, elle passe par un connecteur dédié.

Cette partie regroupe donc les outils qui permettent au serveur d'observer son
contexte d'exécution sans disperser les détails de plateforme dans le reste de
l'application.


### [Capacités de plateforme](ai-docs/src/02-server/30-environment/10-platform.ts)

Utilisation des abstractions communes et des connecteurs pour garder le code
applicatif indépendant du runtime.
 

### [Manipuler les variables d'environnement](ai-docs/src/02-server/30-environment/20-variable.ts)

Chargement de sources d'environnement, validation par `DataStructure` et
obtention d'une configuration typée.
 
# Créer des commandes

Le domaine commande permet de construire des entrées CLI typées pour une
application serveur.

Une commande décrit les arguments et options qu'elle accepte, puis reçoit ces
valeurs déjà interprétées dans son callback d'exécution. La même déclaration
sert aussi à produire l'aide et les erreurs de ligne de commande.

Les sous-commandes permettent ensuite de structurer une CLI comme un arbre,
sans changer le modèle d'exécution d'une commande simple.


### [Définir une commande](ai-docs/src/02-server/40-command/10-use.ts)

Déclaration d'arguments, d'options et récupération des valeurs typées
dans le callback d'exécution.
 

### [Créer des sous-commandes](ai-docs/src/02-server/40-command/20-sub-command.ts)

Composition de commandes sous forme d'arbre pour router l'exécution vers
une branche spécialisée.
 
# Client

Le client est l'endroit où les données typées rencontrent l'interaction utilisateur : requêtes HTTP, formulaires, validations et comportements d'interface.

DuploJS ramène ces usages vers des contrats et des compositions déclaratives afin de garder un code homogène, fortement typé et adaptable sans disperser la logique propre à chaque écran.

# Client HTTP

Consommation typée d'une interface HTTP DuploJS à partir de son contrat
statique : initialisation du client, requêtes disponibles, réponses attendues
et réactions communes au cycle des échanges.

Le client conserve le lien entre une route appelée et les réponses qu'elle peut
produire. Les `information` déclarées côté serveur deviennent le discriminant
principal pour traiter un cas de réponse précis côté client.


### [Initialiser un client HTTP](ai-docs/src/03-client/10-http/10-init.ts)

Création d'un client à partir du contrat statique des routes, configuration
globale et conservation du typage des requêtes et réponses exposées par le
serveur.
 

### [Effectuer une requête HTTP](ai-docs/src/03-client/10-http/20-request.ts)

Construction d'une `PromiseRequest`, envoi des paramètres attendus par la
route et sélection des réponses typées par `information`, code HTTP ou
famille de statut.
 

### [Utiliser les hooks du client HTTP](ai-docs/src/03-client/10-http/30-hook.ts)

Centralisation des comportements communs au cycle d'une requête : réactions
globales, effets de bord, instrumentation et transformations techniques sans
élargir le contrat typé des routes.
 
# Form

Formulaires déclaratifs et typés : composition de champs, layouts, validations,
états internes et templates de rendu.

L'objectif est d'éviter que chaque écran reconstruise sa propre manière de
gérer les valeurs, les erreurs et les comportements locaux. Le formulaire est
décrit par composition : chaque élément annonce ce qu'il porte, comment il
s'intègre aux autres et quelle place il occupe dans la valeur finale.

Les inputs portent les valeurs, les layouts structurent ou contrôlent leur
composition, et les templates transforment cette structure en interface Vue.
Cette séparation garde un modèle commun pour `currentValue`, `check`, `reset`
et `dispose`, tout en laissant l'application personnaliser les comportements ou
le rendu quand l'interface l'exige.


### [Créer un formulaire](ai-docs/src/03-client/20-form/10-init.ts)

Initialisation d'un formulaire à partir de templates et d'un `FormField`
racine pour obtenir son composant Vue, sa valeur courante et ses opérations.
 

### [Créer/Utiliser un input](ai-docs/src/03-client/20-form/20-input.ts)

Un composant Vue d'input n'est pas encore une brique de formulaire.

Pour créer un input réutilisable, le raisonnement est toujours le même :
partir d'un composant Vue compatible, le transformer avec `createInput`,
puis composer le champ obtenu dans un formulaire.

Les inputs du design system suivent déjà ce modèle. Ils peuvent être utilisés
directement, ou servir de référence lorsqu'une application crée ses propres
inputs.
 

### [Composer avec les layouts](ai-docs/src/03-client/20-form/30-layout.ts)

Un layout reçoit un ou plusieurs champs et retourne un nouveau champ.

C'est ce qui permet de construire un formulaire par composition : un input
peut être donné à un layout, ce layout peut être donné à un autre layout,
puis le résultat final devient le champ racine passé à `useForm`.

Les layouts structurent la valeur du formulaire ou pilotent un comportement
autour d'un ou plusieurs champs.
 

### [Personnaliser les templates](ai-docs/src/03-client/20-form/40-template.ts)

Adapter le rendu Vue des formulaires, inputs et layouts sans changer la
structure, les validations ou les valeurs manipulées par `@duplojs/form`.
 
# Tests

Repères pour tester un contrat : comportement runtime, branche attendue,
information transportée, valeur obtenue et type conservé.

# Tests unitaires

Tests focalisés sur le contrat d'une API : branche acceptée, donnée obtenue,
information portée par le résultat et type conservé par TypeScript.

Ils vérifient le comportement observé et l'inférence dans le contexte réel
d'utilisation, notamment quand le résultat porte plusieurs issues possibles.


### [Tester un résultat Either](ai-docs/src/04-tests/01-unit/10-either.ts)

Sélectionner l'`information` attendue, unwrap la valeur correspondante puis
vérifier la donnée obtenue et son type. Les helpers `OrThrow` font échouer le
test quand le résultat n'est pas celui visé.
 
# Tests E2E

`@duplojs/playwright` organise Playwright autour du site teste.

La suite nomme les parties du parcours : `Website` pour le contexte global,
`Page` pour les ecrans navigables, `Component` pour les zones reutilisables.

Le test reste un test Playwright, mais il se lit comme une specification :
naviguer, recuperer une page ou un composant, agir, verifier un etat. Les
locators restent dans les objets qui representent l'interface.


### [Initialiser le client E2E](ai-docs/src/04-tests/02-e2e/10-init.ts)

Créer une fixture Playwright qui expose un `Website` par test, avec la
`page`, le `BrowserContext`, la base URL et les hooks de navigation.
 

### [Architecturer une suite E2E](ai-docs/src/04-tests/02-e2e/20-architecture.ts)

Ranger la suite comme le site teste : `Website` pour l'application, `Page`
pour un ecran navigable, `Component` pour une zone reutilisable. Les locators
restent dans ces objets, pas dans chaque spec.
 

### [Ecrire un parcours de test](ai-docs/src/04-tests/02-e2e/30-testing.ts)

Décrire un scénario utilisateur avec les objets du site : naviguer,
récupérer une page ou un composant, appeler des actions nommées, puis
vérifier l'état attendu.

Les helpers `Actions` et `Assertions` manipulent les éléments déclarés dans
`getElements` et conservent le typage des clés disponibles.
 
