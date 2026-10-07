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

Le client est l'endroit où les données typées rencontrent l'interaction
utilisateur. C'est aussi l'endroit où la logique peut facilement se disperser :
requêtes écrites au cas par cas, formulaires propres à chaque écran,
comportements locaux difficiles à maintenir.

DuploJS cherche à ramener ces usages vers une forme plus déclarative et
constante. Les interactions sont décrites à partir de contrats et de
compositions, ce qui permet de garder un code homogène, fortement typé et
assez flexible pour couvrir des interfaces spécifiques sans abandonner le
modèle commun.

# Client HTTP

Le client HTTP permet de consommer une interface HTTP DuploJS à partir d'un
contrat statique partagé.

Ce contrat décrit les routes disponibles, leurs entrées et leurs réponses. Le
client s'appuie dessus pour construire les requêtes et typer les réponses sans
réécrire le modèle exposé par le serveur.

L'idée principale est de garder le lien entre la route appelée et les réponses
qu'elle peut produire. Les `information` déclarées côté HTTP deviennent alors
le moyen discriminer une réponse précis côté client.


### [Initialiser un client HTTP](ai-docs/src/03-client/10-http/10-init.ts)

Un client HTTP se construit à partir du typage des routes exposées par
l'interface HTTP DuploJS.

Ce typage est généralement produit par `codeGeneratorPlugin`.
Le client n'a pas besoin de partager la codebase du serveur :
il consomme uniquement le contrat statique généré.

Ce contrat décrit les méthodes, paths, entrées attendues et réponses
possibles. Il sert ensuite à écrire les requêtes et à traiter leurs
réponses sans redécrire le contrat côté client.
 

### [Effectuer une requête HTTP](ai-docs/src/03-client/10-http/20-request.ts)

Les méthodes `get`, `post`, `patch`, `put`, `delete` et `request`
créent une `PromiseRequest`.

Une `PromiseRequest` lance la requête et ajoute des méthodes de traitement
autour de la réponse typée.

Le pattern principal consiste à :
- construire la requête avec les paramètres attendus par la route
- choisir une manière de traiter la réponse selon le besoin
- discriminer en priorité par `information`, plus stable et explicite
que le statut HTTP
 

### [Utiliser les hooks du client HTTP](ai-docs/src/03-client/10-http/30-hook.ts)

Les hooks permettent de brancher un comportement commun sur le cycle
d'une requête.

Ils peuvent être donnés dans la configuration du client, mais les helpers
`add*Hook` rendent souvent l'intention plus lisible.

Les hooks de requête et de réponse permettent d'intervenir dans le flux :
ajouter un header, remplacer des paramètres, transformer une réponse.

Les hooks ciblés par `information`, code ou type de réponse servent à
centraliser une réaction quand un cas précis apparaît, sans répéter ce
traitement autour de chaque requête.

En pratique, les hooks les plus sains sont souvent ceux qui produisent un
effet de bord : redirection, toast, loader, instrumentation.
Les hooks capables de transformer une requête ou une réponse existent.
Ils doivent être utilisés avec retenue : l'enrichissement produit par un
hook ne change pas le contrat typé de la route.
 
# Form

Les formulaires sont souvent une source de logique dispersée : chaque écran
peut finir avec sa propre manière de gérer les valeurs, les erreurs, les
validations, les états internes et le rendu.

La partie form de DuploJS répond à ce problème en proposant une façon unique,
déclarative et typée de construire un formulaire. Au lieu d'assembler les
comportements de manière impérative, le formulaire est décrit par composition :
chaque élément annonce ce qu'il porte, comment il s'intègre aux autres, et
quelle place il occupe dans la valeur finale.

Cette approche rend le modèle plus constant et plus robuste. Elle couvre déjà
beaucoup de formes de formulaires avec les briques fournies, mais reste
extensible lorsque l'interface demande un comportement ou un rendu spécifique.


### [Créer un formulaire](ai-docs/src/03-client/20-form/10-init.ts)

`@duplojs/form` permet de composer un formulaire par déclaration.

Au lieu de piloter impérativement chaque interaction du formulaire,
on exprime sa structure et ses comportements avec des fonctions.

L'initialisation se fait en deux temps :
- fabriquer une fonction `useForm` avec `createForm`
- passer à cette fonction un `FormField` racine

Le point important est qu'un input retourne un `FormField`, et qu'un layout
retourne aussi un `FormField`. Le champ racine peut donc être un input simple
ou une composition de layouts et d'inputs.

`createForm` ne connaît pas le schéma métier du formulaire.
Il reçoit les templates disponibles, clone la `defaultValue` du champ racine,
instancie la composition sur un état Vue, puis expose le composant et les
opérations du formulaire.
 

### [Créer/Utiliser un input](ai-docs/src/03-client/20-form/20-input.ts)

Un composant Vue d'input n'est pas encore une brique de formulaire.

La séquence est :
- écrire un composant Vue compatible
- le transformer en factory avec `createInput`
- appeler cette factory pour obtenir un `FormField`
- composer ce `FormField` dans un formulaire

Cette séparation permet de garder le composant concentré sur l'interface,
et de laisser `@duplojs/form` gérer son intégration dans `currentValue`,
`reset`, `dispose` et `check`.

Le design system Vue expose déjà des factories prêtes à utiliser pour les
inputs courants. `createInput` sert quand une application veut créer les
siennes.
 

### [Composer avec les layouts](ai-docs/src/03-client/20-form/30-layout.ts)

Un layout reçoit un ou plusieurs `FormField` et retourne un nouveau
`FormField`.

C'est ce qui permet de construire un formulaire par composition : un input
peut être donné à un layout, ce layout peut être donné à un autre layout,
puis le résultat final devient le champ racine passé à `useForm`.

Les layouts ont deux rôles principaux :
- structurer la valeur du formulaire
- piloter un comportement autour d'un ou plusieurs champs

Ils sont librement composables. Un `repeat` peut contenir un `multi`, un
`union` peut contenir un `step`, et un `section` peut simplement envelopper
une composition existante sans changer sa valeur.
 

### [Personnaliser les templates](ai-docs/src/03-client/20-form/40-template.ts)

Les templates définissent le rendu des formulaires, des inputs et des
layouts.

Ils ne changent ni la structure de `currentValue`, ni la valeur retournée
par `check`. Leur rôle est de transformer les props système et les slots
fournis par `@duplojs/form` en interface Vue.

Le découpage mental est simple :
- les `FormField` décrivent la structure
- les layouts composent cette structure
- les templates rendent cette structure
 
# Tests

Les tests DuploJS servent à vérifier que le comportement observé reste aligné
avec les contrats exprimés dans le code.

Comme une grande partie du modèle repose sur le typage, tester ne consiste pas
seulement à comparer une valeur finale. Il faut aussi vérifier que le bon flux
est choisi, que les informations portées par les résultats sont interprétées au
bon endroit, et que les garanties TypeScript importantes sont conservées.

Les tests unitaires se concentrent sur une API précise : son résultat runtime,
ses branches possibles et son inférence dans le contexte d'utilisation prévu.

Les tests E2E gardent une autre responsabilité. Ils décrivent un parcours
utilisateur à travers un site réel, en rangeant les pages, composants, actions
et assertions pour que le test reste lisible quand l'interface grandit.

# Tests unitaires

Les tests unitaires DuploJS vérifient le comportement runtime et les garanties
de typage d'une API.

Un test ne doit pas seulement constater la forme d'une valeur produite. Il doit
exprimer le contrat attendu : quelle branche du flux est acceptée, quelle
information est attendue, quelle valeur est ensuite vérifiée, et quel type doit
être conservé par TypeScript.

### Tester un résultat Either

Un test qui reçoit un `Either` doit d'abord exprimer quel résultat il
attend. Dans DuploJS, cette intention passe le plus souvent par
l'`information` portée par la monade.

Le pattern habituel consiste à sélectionner l'information attendue, unwrap
sa valeur, puis vérifier uniquement la donnée obtenue. Si le résultat n'est
pas celui attendu, les helpers `OrThrow` font échouer le test avant
l'assertion finale.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// Dans les tests du monorepo, Vitest expose ces globals directement.
// Ces déclarations rendent uniquement l'exemple typable dans `ai-docs`.
declare const describe: (title: string, body: () => void) => void;
declare const it: (title: string, body: () => void | Promise<void>) => void;
declare const expect: (value: unknown) => {
	toBe(expected: unknown): void;
	toStrictEqual(expected: unknown): void;
};

interface User {
	id: number;
	email: string;
}

declare function findUserByEmail(
	email: string,
): (
	| DEither.Result<"user.found", User>
	| DEither.Left<"user.notfound", string>
	| DEither.Error<Error>
);

// Le test ne vérifie pas l'implémentation interne de la monade.
// Il s'appuie sur `DEither` comme passe-plat : si l'information attendue
// n'est pas présente, l'unwrap échoue déjà.
describe("findUserByEmail", () => {
	it("returns the found user", () => {
		const result = findUserByEmail("jane@duplo.dev");

		const user = DEither.unwrapByInformationOrThrow(
			result,
			"user.found",
		);

		expect(user).toStrictEqual({
			id: 1,
			email: "jane@duplo.dev",
		});

		type _CheckUser = DCommon.ExpectType<
			typeof user,
			User,
			"strict"
		>;
	});

	it("returns the not found email", () => {
		const result = findUserByEmail("missing@duplo.dev");

		const email = DEither.unwrapByInformationOrThrow(
			result,
			"user.notfound",
		);

		expect(email).toBe("missing@duplo.dev");
	});
});

// Quand le test accepte plusieurs résultats possibles, la sélection rend la
// décision explicite. Les résultats marqués `true` sont unwrap. Les autres
// font échouer le test.
describe("findUserByEmail selection", () => {
	it("accepts only the business results handled by this test", () => {
		const result = findUserByEmail("jane@duplo.dev");

		const value = DEither.unwrapSelectionOrThrow(
			result,
			{
				"user.found": true,
				"user.notfound": true,
				error: false,
			},
		);

		type _CheckValue = DCommon.ExpectType<
			typeof value,
			User | string,
			"strict"
		>;

		if (typeof value === "string") {
			expect(value).toBe("jane@duplo.dev");
		} else {
			expect(value).toStrictEqual({
				id: 1,
				email: "jane@duplo.dev",
			});
		}
	});
});

// `DEither.expect` sert surtout quand le contrat dit qu'une valeur est déjà un
// `Either` et que le test veut matérialiser cette garantie dans le typage.
describe("DEither.expect", () => {
	it("keeps the exact either type", () => {
		const input = DEither.success(42);
		const result = DEither.expect(input);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;

		// @ts-expect-error input must be an Either
		DEither.expect("plain value");
	});
});

// Pour une API curifiée, le test de typage doit rester dans le contexte réel
// d'utilisation. Ici, `unwrapByInformationOrThrow` est testé dans `pipe`.
describe("curried Either helpers", () => {
	it("preserves inference in a pipe", () => {
		const result = DCommon.pipe(
			findUserByEmail("jane@duplo.dev"),
			DEither.unwrapByInformationOrThrow("user.found"),
		);

		expect(result.email).toBe("jane@duplo.dev");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			User,
			"strict"
		>;
	});
});
```
# Tests E2E

`@duplojs/playwright` est une couche d'organisation au-dessus de Playwright.
Elle ne remplace pas les locators, les assertions ni le runner Playwright :
elle aide surtout a ranger le test autour du site qu'on manipule.

L'idee est de donner des noms aux parties importantes du parcours : un
`Website` pour le contexte global, des `Page` pour les ecrans navigables et
des `Component` pour les morceaux d'interface que l'on reutilise.

Un test reste donc un test Playwright, mais il se lit plus naturellement :
aller sur une page, recuperer un composant, faire une action, verifier un
etat. Quand la suite grossit, cette structure evite de recopier les memes
locators et les memes intentions dans chaque spec.


### [Initialiser le client E2E](ai-docs/src/04-tests/02-e2e/10-init.ts)

DuploJS Playwright s'utilise depuis un client Playwright etendu.
La fixture cree un `Website` pour chaque test avec la `page`
Playwright et le `BrowserContext`.

Ensuite, le test passe par ce `Website` pour naviguer, verifier
l'URL, ajouter des cookies, appliquer un prefix, lancer des hooks
ou attendre l'hydratation.
 

### [Architecturer une suite E2E](ai-docs/src/04-tests/02-e2e/20-architecture.ts)

La suite est rangee comme le site teste, pas comme une liste de locators.

Le `Website` correspond a l'application ouverte par Playwright.
Une `Page` correspond a un ecran et connait son path.
Un `Component` correspond a une zone d'interface que l'on peut reutiliser.

Les tests utilisent ces objets pour raconter un parcours. Les locators
restent dans les pages et composants, au lieu d'etre eparpilles dans
chaque spec.
 

### [Ecrire un parcours de test](ai-docs/src/04-tests/02-e2e/30-testing.ts)

Un test E2E DuploJS Playwright suit le parcours d'un utilisateur :
on navigue, on recupere une page ou un composant, puis on enchaine
actions et assertions.

Les helpers `Actions` et `Assertions` travaillent avec les elements nommes
dans `getElements`. Ils ajoutent des steps Playwright lisibles et gardent
le typage des cles disponibles sur le composant.
 
