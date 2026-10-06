## Duplojs ecosystem

L'écosystème DuploJS a pour but de compenser les manquements de TypeScript grâce à la puissance des génériques de celui-ci. Les features fondatrices sont surtout là pour améliorer la modélisation de la donnée et également pour la manipuler.

Le principe d'un logiciel c'est de gérer de la donnée. Donc il faut particulièrement faire attention à ses structures, â ses états et â ses transitions des données qui constitueront leurs cycle de vie. DuploJS a pour vocation de vouloir améliorés et standardiser la modélisation de tout ça afin de créer des logiciels robustes et scalables.
## Les `Constraint` de type.

Le point central d'un logiciel, c'est toujours sa donnée. Mieux elle est modélisée, plus la santé du logiciel est bonne. Les contraintes dans Duplo sont là pour pouvoir modéliser des données le plus finement possible afin qu'aucune ambiguïté soit permise.


### L'utilisation des `Constraint`.

Les contraintes existent uniquement au niveau du typage, mais elles
garantissent en amont l'appel de fonctions qui vérifie la contrainte au runtime.
 

```ts
import * as DNumber from "@duplojs/lang/number";

type Age = number & DNumber.Integer & DNumber.Positive;

// @ts-expect-error Impossible d'être assigner comme tels sans vérification en amont.
const age: Age = 12;

const maybeAge = 12;
if (
	DNumber.isInteger(maybeAge)
	&& DNumber.isPositive(maybeAge)
) {
	const age: Age = maybeAge;
}
```

### Manipulation des variable avec des `Constraint`.

Les contraintes impliquent des vérités sur la données au run time.
Les vérités sont exploitées par les fonctions de la librairie.
Cela permet de compenser les problèmes de typage faibles de TypeScript de base.
Toute manipulation implique également perte/changement de contrainte pour la valeur obtenue.
 

```ts
import * as DTuple from "@duplojs/lang/tuple";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";

declare const userEmail: string & DString.Email;

// Un email dans son format contenant obligatoirement un "@"
// donne forcément un tableau avec minimum 2 éléments.
// string[] & DArray.MinElements<2>
const spitedEmail = DString.split(userEmail, "@");

// Le passage du tableau en tuple est fait en interprétant la contrainte
// DArray.MinElements<2>, ce qui permet de déduire que le tableau a forcément deux éléments.
// [string, string, ...string[]]
const [first, second, ...maybeRest] = DTuple.from(spitedEmail);

// string
const firstElement = DArray.first(spitedEmail);

// string
const lastElement = DArray.last(spitedEmail);

// string
const secondElement = DArray.at(spitedEmail, 1);

// string | undefined
const otherElement = DArray.at(spitedEmail, 10);
```

### [Utiliser les contraintes fournies](ai-docs/src/01-fundamental/01-constraint/10-built-in-constraint.ts)

DuploJS fournit des contraintes pour les cas courants.
Avant de définir une nouvelle contrainte, vérifier si une contrainte
existante représente déjà la propriété recherchée.

Elles couvrent notamment les number, string, array,
et autres propriétés courantes.
 

### [Cast d'une contrainte](ai-docs/src/01-fundamental/01-constraint/20-cast.ts)

Le cast permet de considérer une donnée comme respectant une contrainte sans
exécuter sa validation.

Le typage calcule la compatibilité et autorisera son utilisation uniquement
si une contrainte en induit une autre. Exemple, si j'attends un nombre avec
`DNumber.LessThan<20>` alors un contrainte `DNumber.LessThan<10>` est correct.
 

### [Créations de `Constraint` customisées.](ai-docs/src/01-fundamental/01-constraint/30-custom-constraint.ts)

DuploJS met à disposition énormément de contraintes, mais il est tout
à fait possible de créer ses propres contraintes. Il suffit juste
d'étendre l'interface `Constraint`.

Il faut évidemment associer un predicate à la contrainte afin de pouvoir
l'obtenir par une vérification.

Il est également possible d'ajouter des casts customisés selon le
besoin. Pour cela, il suffit de déclarer des override de modules.
 
## Currying

Dans DuploJS, les fonctions curifiées sont conçues pour être utilisées dans des `pipe`.

Il faut privilégier cette forme pour manipuler et transformer les données, en utilisant en priorité les fonctions déjà fournies par l'écosystème.

### Utilisation de la currification.

Dans DuploJS, les fonctions curifiées sont principalement conçues pour
composer des transformations dans des `pipe`.

Dès qu'une même donnée doit subir plusieurs transformations successives,
il faut privilégier un `pipe`.

Cela permet d'ajouter, retirer ou réordonner facilement des transformations
sans modifier la structure générale du traitement.

Pour une opération unique qui reçoit directement la donnée, utiliser
directement la fonction est suffisant.

Lorsqu'un traitement est susceptible d'accueillir d'autres transformations,
il est également pertinent de commencer directement avec un `pipe`.

Lorsqu'un `pipe` est utilisé, il faut privilégier les fonctions curifiées
fournies par l'écosystème plutôt que réimplémenter les transformations
avec des callbacks ou des API natives.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// Une seule transformation ne nécessite pas forcément de `pipe`.
const trimmedName = DString.trim(" John ");

// Dès qu'une donnée subit plusieurs transformations successives,
// il faut privilégier un `pipe`.
//
// readonly (Lowercase<string> & DString.MinCharacters<1>)[] & DArray.MaxElements<3>
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);

// Les fonctions curifiées permettent de configurer une transformation
// avant que la donnée ne leur soit fournie par le `pipe`.
//
// `DString.split(",")` configure le séparateur.
// La chaîne à découper sera fournie ensuite par `pipe`.
//
// `DArray.map(DString.trim)` configure également une transformation
// qui recevra ensuite le tableau provenant de l'étape précédente.

// `innerPipe` permet d'enchaîner plusieurs transformations lorsqu'une
// fonction de transformation est elle-même attendue.
//
// readonly (Lowercase<string> & DString.NotEmpty)[] & DArray.MaxElements<3>
const normalizedTagsWithInnerPipe = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(
		DCommon.innerPipe(
			DString.trim,
			DString.toLowerCase,
		),
	),
	DArray.filter(DString.isNotEmpty),
);

// `innerPipe` évite de créer une callback intermédiaire uniquement
// pour enchaîner plusieurs transformations.
//
// readonly (number & Positive)[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>
const tagLengths = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(
		DCommon.innerPipe(
			DString.trim,
			DString.length,
		),
	),
);

// `asyncPipe` applique le même principe lorsqu'une ou plusieurs étapes
// du traitement sont asynchrones.
//
// Promise<readonly Lowercase<string>[] & DArray.LengthEqual<2> & DArray.MinElements<2> & DArray.MaxElements<2>>
const asyncTags = DCommon.asyncPipe(
	Promise.resolve(" TypeScript, DuploJS " as const),
	DString.split(","),
	DArray.map(DString.trim),
	(tags) => Promise.resolve(tags),
	DArray.map(DString.toLowerCase),
);

// `asyncInnerPipe` permet de composer plusieurs transformations synchrones
// ou asynchrones lorsqu'une callback asynchrone est attendue.
//
// Promise<readonly Promise<Lowercase<string>>[] & DArray.LengthEqual<2>>
const values = DCommon.asyncPipe(
	[" TypeScript ", " DuploJS "] as const,
	DArray.map(
		DCommon.asyncInnerPipe(
			(value) => Promise.resolve(value),
			DString.trim,
			DString.toLowerCase,
		),
	),
);
```

### Fonctions intégrées compatibles avec les `pipe`.

L'écosystème DuploJS fournit de nombreuses fonctions conçues pour être
directement utilisées dans des `pipe`.

Il faut privilégier les fonctions fournies par l'écosystème plutôt que
réimplémenter une transformation avec une callback.

Avant d'écrire une fonction intermédiaire, il faut rechercher si une
fonction curifiée ou directement compatible avec `pipe` existe déjà.

Ce principe ne concerne pas uniquement `@duplojs/lang`. Les autres packages
de l'écosystème exposent également des fonctions pouvant être composées
dans des pipes.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import * as DObject from "@duplojs/lang/object";
import * as DNumber from "@duplojs/lang/number";
import * as DEither from "@duplojs/lang/either";
import * as DTuple from "@duplojs/lang/tuple";
import * as DChrono from "@duplojs/lang/chrono";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPattern from "@duplojs/lang/pattern";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

// Les fonctions de `string` et `array` sont faites pour être composées.
// readonly (Lowercase<string> & DString.MinCharacters<1>)[] & DArray.MaxElements<4>
const normalizedNames = DCommon.pipe(
	[" John ", "", " JANE ", " Alice "],
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
	DArray.sort((left, right) => left.localeCompare(right)),
);

// Les prédicats de `number` peuvent directement être utilisés
// dans les fonctions de manipulation de tableaux.
// number
const adultAges = DCommon.pipe(
	[12, 18, 42, 8, 21],
	DArray.filter(DNumber.greaterThanOrEqual(18)),
	DNumber.sum,
);

// Les fonctions de `object` sont également prévues pour le pipe.
// {
//     name: string & DString.Trimmed & DString.MaxCharacters<6>;
//     readonly age: 24;
// }
const publicUser = DCommon.pipe(
	{
		name: " John ",
		password: "secret",
		age: 24,
	},
	DObject.transformProperty("name", DString.trim),
	DObject.omit(["password"]),
);

// `innerPipe` permet de composer plusieurs fonctions intégrées
// directement à l'endroit où une callback est attendue.
// readonly { name: Lowercase<string>; }[] & DArray.LengthEqual<2>
const users = DCommon.pipe(
	[
		{
			name: " John ",
			age: 24,
		},
		{
			name: " JANE ",
			age: 32,
		},
	],
	DArray.map(
		DCommon.innerPipe(
			DObject.transformProperty(
				"name",
				DCommon.innerPipe(
					DString.trim,
					DString.toLowerCase,
				),
			),
			DObject.pick(["name"]),
		),
	),
);

// Les fonctions `Either` sont elles aussi composables avec les pipes.
declare const maybeName:
	| DEither.Right<"user-found", string>
	| DEither.Left<"user-not-found">;

// Lowercase<string>
const name = DCommon.pipe(
	maybeName,
	DEither.unwrapOr("anonymous"),
	DString.trim,
	DString.toLowerCase,
);

// `Either` possède également ses propres pipes lorsque le traitement
// doit continuer uniquement sur une valeur `Right`.
// DEither.Left<"user-not-found", unknown> | DEither.Success<Lowercase<string>>
const normalizedEitherName = DEither.rightPipe(
	maybeName,
	DString.trim,
	DString.toLowerCase,
);

// Les tuples disposent eux aussi de fonctions curifiées.
// readonly [string & DString.Trimmed & DString.MaxCharacters<6>, string & DString.Trimmed & DString.MaxCharacters<6>]
const normalizedTuple = DCommon.pipe(
	[" John ", " Jane "] as const,
	DTuple.map(DString.trim),
);

// Les generators permettent de construire des transformations lazy
// avec exactement le même modèle de composition.
// readonly (Lowercase<string> & DString.MinCharacters<1>)[]
const generatedNames = DCommon.pipe(
	[" John ", "", " JANE ", " Alice "],
	DGenerator.map(DString.trim),
	DGenerator.filter(DString.isNotEmpty),
	DGenerator.map(DString.toLowerCase),
	DArray.from,
);

// Les fonctions de date peuvent être utilisées directement dans les pipes.
declare const creationDate: DChrono.TheDate;

// string
const serializedCreationDate = DCommon.pipe(
	creationDate,
	DChrono.formatDate(
		"YYYY-MM-DD HH:mm:ss",
		"Europe/Paris",
	),
);

// Le pattern matching fournit également des fonctions curifiées.
declare const status: "draft" | "published" | "archived";

// "Draft" | "Published" | "Archived"
const statusLabel = DCommon.pipe(
	status,
	DPattern.matchWithStringOtherwise(
		{
			draft: () => "Draft" as const,
			published: () => "Published" as const,
		},
		() => "Archived" as const,
	),
);

// Les fonctions n'ont pas besoin d'être curifiées lorsqu'elles reçoivent
// déjà la donnée comme unique argument : elles peuvent être utilisées
// directement comme étape du pipe.
declare const filePath: string & DPath.Path;

// string & DString.Trimmed
const fileContent = await DCommon.asyncPipe(
	filePath,
	DSFile.readTextFile,
	DEither.unwrapOr(""),
	DString.trim,
);

// Les fonctions curifiées existent également dans `@duplojs/server`.
// DSFile.WriteTextFileResult
const writeResult = await DCommon.asyncPipe(
	filePath,
	DSFile.writeTextFile("Hello world"),
);

// Cela permet de composer des traitements provenant de plusieurs packages.
// DCommon.Json | {}
const jsonContent = await DCommon.asyncPipe(
	filePath,
	DSFile.readJsonFile,
	DEither.unwrapOr({}),
);
```
## Traiter un resulta avec either.

Either est un domaine qui regroupe la définition de monades représentants les résultats ainsi que de fonctions utilitaires pour les manipuler. Les monades de DuploJS ont une particularité, elles portent toujours une information permettant de créer un résultat contextuel traçable. L'information sert égalment a discriminer précisément un résulta.

### L'utilisation des monode Either.

Toutes les monades sont étendues des monade Right et Left.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// DEither.Right<"my-result", "superData">
const result = DEither.right("my-result", "superData");

interface User {}
// DEither.None | DEither.Some<"value">
declare function findUser(): DEither.Maybe<User>;

// Plein de façons différentes de décrire les résultats.
declare function someAction(): (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// DEither.None | DEither.Success<"value">
const whenIsRightResult = DCommon.pipe(
	findUser(),
	DEither.whenIsRight(
		(user) => {
			// User
			void user;

			return DEither.success("value");
		},
	),
);
```

### [Manipulations des monode Either.](ai-docs/src/01-fundamental/03-either/10-manipulation.ts)

Il y a plusieurs outils pour manipuler les Either qui permettent de les
discriminer, d'effectuer des actions selon leur information, de gérer
des flux en faisant redescendre les erreurs, et autres outils permettant
de rendre la gestion de résultats le plus robuste possible.
 
## Les `DataStructures`

Les `DataStructures` permettent de décrire précisément une donnée avec une représentation exploitable à la fois par TypeScript et au runtime.

Elles servent notamment à :

- construire et composer des structures de données ;
- appliquer des contraintes ;
- valider des données inconnues ;
- encoder et décoder une même structure grâce aux codecs ;
- représenter des structures récursives ;
- produire et interpréter des erreurs structurées.

Elles doivent être utilisées aux frontières du logiciel afin de garantir que les données qui entrent dans le domaine respectent bien la représentation attendue.

### Utilisation des `DataStructures`.

Une `DataStructure` décrit la représentation attendue d'une donnée
à la fois au niveau TypeScript et au runtime.

Elle est principalement utilisée aux frontières du logiciel, lorsque
la donnée n'est pas encore considérée comme fiable.

Une structure permet ensuite quatre opérations principales :

- `check` : valider une donnée déjà dans sa représentation interne ;
- `decode` : convertir une représentation externe vers la représentation interne ;
- `encode` : convertir la représentation interne vers une représentation externe ;
- `is` : vérifier qu'une donnée respecte la structure.

`check`, `decode` et `encode` retournent un `Either` contenant soit
la donnée validée, soit une erreur structurée.
 

```ts
import * as DDataStructure from "@duplojs/lang/dataStructure";

const componentStructure = DDataStructure.object({
	id: DDataStructure.bigint(),
	name: DDataStructure.string(),
	alt: DDataStructure.optional(
		DDataStructure.string(),
	),
	image: DDataStructure.object({
		src: DDataStructure.string([DDataStructure.url()]),
	}),
});

// Le type TypeScript correspondant à une structure peut être récupéré
// avec `StructureValue`.
//
// {
//     readonly id: bigint;
//     readonly name: string;
//     readonly alt?: string | undefined;
//     readonly image: {
//         readonly src: string & DString.Url;
//     };
// }
type Component = DDataStructure.StructureValue<typeof componentStructure>;

declare const unknownComponent: unknown;

// `check` valide une donnée déjà dans sa représentation interne.
//
// Il est principalement utilisé lorsqu'une donnée provient d'une source
// non fiable mais ne nécessite aucune transformation de représentation.
const checkResult = componentStructure.check(
	unknownComponent,
);

// `decode` transforme une représentation externe vers la représentation
// interne décrite par la structure, puis valide la donnée obtenue.
//
// Ici, `codecsJson` permet notamment de transformer `string` en `bigint`.
const decodeResult = componentStructure.decode(
	DDataStructure.codecsJson,
	{
		id: "42",
		name: "Header",
		image: {
			src: "https://duplojs.dev/image.png",
		},
	},
);

declare const component: Component;

// `encode` réalise l'opération inverse de `decode`.
//
// Il transforme une donnée interne vers la représentation attendue
// par le système externe.
//
// Ici, `codecsJson` transforme notamment `bigint` en `string`.
const encodeResult = componentStructure.encode(
	DDataStructure.codecsJson,
	component,
);

declare const value: unknown;

// `is` permet de vérifier simplement si une donnée respecte la structure.
//
// Contrairement à `check`, il ne retourne pas les détails de l'erreur.
// Il agit également comme un type predicate TypeScript.
if (componentStructure.is(value)) {
	// Component
	void value;
}

// Les opérations existent également sous forme asynchrone lorsque
// la structure contient des traitements asynchrones.
const asyncCheckResult = componentStructure.asyncCheck(
	unknownComponent,
);
```

### [Création et composition des `DataStructures`.](ai-docs/src/01-fundamental/04-data-structure/10-structure.ts)

Une `Structure` représente une donnée au niveau du typage et du runtime.
Elle permet de construire un type TypeScript tout en conservant une
représentation capable de vérifier réellement la donnée.

Les `TypeStructure` représentent directement un `Type`, comme `string`,
`number`, `boolean` ou une valeur littérale.

Les autres structures comme `ObjectStructure`, `ArrayStructure`,
`UnionStructure` ou `RecordStructure` permettent de composer plusieurs
structures entre elles pour représenter des données plus complexes.
 

### [Les contraintes dans les `DataStructures`.](ai-docs/src/01-fundamental/04-data-structure/20-constraint.ts)

Une `Structure` décrit d'abord la nature de la donnée puis peut lui appliquer
des contraintes supplémentaires.

Les contraintes sont vérifiées au runtime et leur résultat est également
reporté dans le type produit par `StructureValue`.

Toutes les structures peuvent recevoir des contraintes, à condition que
celles-ci soient compatibles avec la donnée représentée.
 

### [Les `Codecs`.](ai-docs/src/01-fundamental/04-data-structure/30-codecs.ts)

Un codec permet de faire transiter une donnée entre deux représentations
à partir d'une même `DataStructure`.

Il définit deux transformations :
- `encode` : état interne -> état externe
- `decode` : état externe -> état interne

Un codec est associé à un `FundamentalType`. Ce type fondamental sert de
repère pendant le parcours d'une structure pour déterminer quelles valeurs
doivent être transformées.

Une fois les codecs enregistrés, la structure peut donc être parcourue dans
les deux sens sans avoir à définir un schéma différent pour chaque état.
 

### [Les `DataStructures` récursives.](ai-docs/src/01-fundamental/04-data-structure/40-recurcive.ts)

Une structure récursive doit pouvoir se référencer elle-même.

TypeScript ne peut pas inférer entièrement ce type de structure.
Il faut donc déclarer le type attendu en amont, puis utiliser `lazy`
pour différer l'accès à la structure récursive.

`contract` permet ensuite de vérifier que le type déclaré manuellement
est strictement égal au type réellement produit par la structure.
 

### [Interprétation des erreurs des `DataStructures`.](ai-docs/src/01-fundamental/04-data-structure/50-interpret-error.ts)

Les erreurs produites par les `DataStructures` sont structurées et conservent
la source exacte du problème : structure, type, contrainte ou codec.

`createErrorInterpreter` permet ensuite de transformer ces informations
techniques en messages exploitables grâce à des dictionnaires.

Cette séparation permet de conserver une erreur riche et indépendante
de sa représentation finale : message utilisateur, API, logs, traduction, etc.
 
## Manipuler le temps avec `chrono`

`chrono` regroupe les outils utilisés pour représenter et manipuler les dates et les durées.

Deux types principaux sont utilisés :

- `TheDate` représente un instant précis ;
- `TheTime` représente une durée ou une quantité de temps.

Il faut privilégier ces types aux `Date` et `number` natifs afin de conserver une représentation explicite et contrôlée du temps dans le domaine.

`chrono` fournit notamment les outils pour :

- créer des dates et des temps de manière sûre ;
- manipuler, comparer et calculer des dates ou des durées ;
- sérialiser ces valeurs dans un format identifiable et transportable ;
- gérer l'interprétation et l'affichage selon les fuseaux horaires.

Une `TheDate` représente toujours un instant absolu. Les fuseaux horaires ne doivent intervenir que lorsqu'une date locale doit être interprétée ou lorsqu'un instant doit être présenté dans un contexte local.

### Création de dates et de temps.

`chrono` distingue deux types :
- `TheDate` représente une date ;
- `TheTime` représente une quantité de temps.

Lorsque la valeur peut être vérifiée au niveau du typage, les fonctions
de création retournent directement `TheDate` ou `TheTime`.

Lorsque la valeur n'est connue qu'au runtime, elles retournent une monade
permettant de représenter explicitement l'échec de la création.
 

```ts
import * as DChrono from "@duplojs/lang/chrono";

// Les dates littérales au format YYYY-MM-DD sont vérifiées par le typage.

// DChrono.TheDate
const date = DChrono.createDate("2026-09-30");

// Les temps sont également sûrs lorsque la valeur littérale
// et son unité permettent d'être vérifiées par le typage.

// DChrono.TheTime
const time = DChrono.createTime(2, "hour");

// Lorsque la valeur provient du runtime, sa validité n'est plus garantie.
declare const dateInput: string;
declare const timeInput: number;

// DChrono.MayBeDate
// DEither.Right<"date-created", DChrono.TheDate>
// | DEither.Left<"date-created-error", null>
const maybeDate = DChrono.createDate({
	value: dateInput,
});

// DChrono.MayBeTime
// DEither.Right<"time-created", DChrono.TheTime>
// | DEither.Left<"time-created-error", null>
const maybeTime = DChrono.createTime(timeInput);

// Les variantes `OrThrow` permettent de récupérer directement la valeur.
// Une entrée invalide provoquera une `CreateTheDateError`
// ou une `CreateTheTimeError`.

// DChrono.TheDate
const dateOrThrow = DChrono.createDateOrThrow({
	value: dateInput,
});

// DChrono.TheTime
const timeOrThrow = DChrono.createTimeOrThrow(timeInput);

// Les objets natifs et timestamps sont également considérés
// comme des valeurs runtime potentiellement invalides.

// DChrono.MayBeDate
const maybeNativeDate = DChrono.createDate(new Date());

// DChrono.MayBeDate
const maybeTimestampDate = DChrono.createDate(Date.now());
```

### [Manipulation des dates et des temps.](ai-docs/src/01-fundamental/05-chrono/10-manipulation.ts)

`TheDate` et `TheTime` sont immuables.
Les opérations de manipulation retournent donc toujours une nouvelle valeur.

La majorité des opérations sont curifiées afin d'être utilisées dans des `pipe`.
 

### [Sérialisation des dates et des temps.](ai-docs/src/01-fundamental/05-chrono/20-serialized.ts)

`chrono` possède un format de sérialisation dédié pour `TheDate` et `TheTime`.

Ce format conserve directement leur valeur numérique et permet de reconnaître
explicitement qu'une string représente une date ou un temps DuploJS.

Il est principalement destiné au transport de données : JSON, API,
persistance, messages, etc.
 

### [Gestion des fuseaux horaires.](ai-docs/src/01-fundamental/05-chrono/30-timezone.ts)

`TheDate` représente toujours un instant absolu à travers son timestamp.
Le fuseau horaire intervient uniquement lorsqu'une date locale doit être
interprétée ou lorsqu'un instant doit être lu dans un contexte local.

Les fuseaux acceptés sont typés avec `DChrono.Timezone`.
 
## Modélisation

La modélisation consiste à représenter explicitement les concepts, les états, les identités et les relations qui structurent un logiciel.

Elle ne concerne pas uniquement la forme des données. Elle permet également d'exprimer des règles de cycle de vie, des préconditions, des garanties de passage ou encore l'identité précise de certaines opérations.

Dans l'écosystème DuploJS, ces besoins sont notamment couverts par :

- les `NewType`, `Entity` et `TaggedObject` pour représenter précisément les données et leur identité ;
- les `Flag` et `Fact` pour représenter les états et les transitions d'un cycle de vie ;
- les `Evidence` pour prouver dans le typage qu'une valeur est passée par une opération particulière ;
- les `SignedFunction` pour donner une identité précise à une fonction au-delà de sa simple signature TypeScript.

L'objectif est de rendre explicites dans les types et les signatures des informations qui resteraient autrement implicites ou impossibles à représenter précisément avec TypeScript seul.

### [Déclaration et hydratation d'une `Entity`.](ai-docs/src/01-fundamental/06-modeling/10-entity.ts)

Une `Entity` représente une donnée métier identifiée explicitement dans le typage.

Ses propriétés sont généralement définies avec des `NewType`.
Ils permettent de conserver le type primitif de la donnée tout en y associant
une identité et des contraintes propres au domaine.

Une entité peut ensuite être hydratée depuis des données dont le typage est
moins précis, comme celles provenant d'une base de données ou d'un repository.
 

### [Déclaration et hydratation d'un `TaggedObject`.](ai-docs/src/01-fundamental/06-modeling/20-tagged-object.ts)

Un `TaggedObject` représente un objet possédant une identité explicite.

Il normalise le pattern classique consistant à ajouter manuellement
une propriété `type`, `kind`, `status`, etc. afin de créer une union
discriminée.

L'identité du `TaggedObject` est gérée directement par DuploJS et fait
partie de la donnée.

Une fois le `TaggedObject` créé, cette identité est conservée lors de sa
sérialisation et de son transport. Un autre consommateur peut donc directement
le discriminer sans avoir à l'hydrater à nouveau.

L'hydratation intervient principalement lorsqu'une donnée externe entre
dans le domaine sans encore posséder cette identité.

Contrairement à une `Entity`, les propriétés d'un `TaggedObject` ne sont
pas obligées d'être représentées par des `NewType`.
 

### [Cycle de vie d'une `Entity`.](ai-docs/src/01-fundamental/06-modeling/30-entity-lifecycle.ts)

Le cycle de vie d'une entité décrit :
- les différents états qu'elle peut posséder ;
- les `Flag` permettant de prouver ces états dans le typage ;
- les `Fact` représentant les événements qui font évoluer l'entité ;
- les conséquences qui doivent être résolues à la suite de certains faits.

L'objectif est de représenter les règles du cycle de vie directement
dans le modèle et dans les signatures des fonctions.
 

### [Preuves au niveau du typage.](ai-docs/src/01-fundamental/06-modeling/40-type-level-proof.ts)

Certaines règles ne concernent pas uniquement la forme d'une donnée,
mais aussi les opérations par lesquelles elle est passée.

Les `Evidence` permettent de représenter ces preuves uniquement dans
le système de types.

Les `SignedFunction` appliquent le même principe à l'identité d'une fonction :
une dépendance peut demander une fonction précise plutôt qu'une fonction
possédant simplement la même signature TypeScript.

Ces outils permettent ainsi d'exprimer des relations entre plusieurs
opérations directement dans leurs signatures.
 
## Discrimination

La discrimination consiste à identifier précisément une valeur parmi plusieurs possibilités afin d'adapter son typage et son traitement au cas réellement rencontré.

Dans DuploJS, il faut privilégier les données qui possèdent une identité explicite et utiliser les outils de discrimination associés :

- `matchWithEntity` pour discriminer des `Entity` ;
- `matchWithFact` pour discriminer les `Fact` portées par une valeur ;
- `matchWithTaggedObject` pour discriminer des `TaggedObject` ;
- `matchWithString` et `matchWithNumber` pour discriminer des unions de literals.

Ces outils permettent notamment de réaliser des sélections exhaustives. L'ajout d'une nouvelle possibilité dans une union oblige alors le code concerné à prendre explicitement en charge ce nouveau cas.

Les variantes `otherwise` permettent au contraire de ne sélectionner qu'une partie des possibilités tout en conservant un typage précis de ce qui reste à traiter.

Lorsque la donnée ne possède pas de discriminant exploitable, `match`, `when` et `whenNot` permettent également une discrimination par élimination à partir de sa shape ou de predicates.

Cette dernière approche est principalement utile pour manipuler des données externes ou des modèles dont la conception ne permet pas une discrimination plus explicite. Lorsque le modèle est contrôlé, il faut préférer une identité clairement représentée dans la donnée.

### [Discrimination des `Entity`.](ai-docs/src/01-fundamental/07-discrimination/10-entity.ts)

Les `Entity` possèdent une identité associée à leur nom.

Le domaine `pattern` permet d'utiliser cette identité pour discriminer
une union d'entités sans dépendre de leur structure ou de leurs propriétés.

`matchWithEntity` réalise une discrimination exhaustive.
`matchWithEntityOtherwise` permet de ne traiter explicitement
qu'une partie des entités et de regrouper les autres dans un fallback.
 

### [Discrimination des `Fact`.](ai-docs/src/01-fundamental/07-discrimination/20-fact.ts)

Une `Fact` possède une identité associée à son nom.

Lorsqu'une `Fact` est appliquée à une entité, cette identité ainsi que
sa payload sont conservées sur l'entité.

Le domaine `pattern` permet d'utiliser cette identité pour discriminer
une union selon la `Fact` actuellement portée par chaque valeur.

`matchWithFact` réalise une discrimination exhaustive.
`matchWithFactOtherwise` permet de ne traiter explicitement
qu'une partie des facts et de regrouper les autres dans un fallback.
 

### [Discrimination des `TaggedObject`.](ai-docs/src/01-fundamental/07-discrimination/30-tagged-object.ts)

Un `TaggedObject` possède une identité associée à son tag.

Cette identité fait partie de la donnée et peut être utilisée pour
discriminer une union de `TaggedObject` sans dépendre de leurs propriétés.

Le domaine `pattern` fournit des matchers dédiés à cette discrimination.

`matchWithTaggedObject` réalise une discrimination exhaustive.
`matchWithTaggedObjectOtherwise` permet de ne traiter explicitement
qu'une partie des tags et de regrouper les autres dans un fallback.
 

### [Discrimination des primitives et par élimination.](ai-docs/src/01-fundamental/07-discrimination/40-primitive.ts)

Pour les unions de literals `string` ou `number`, les fonctions
`matchWithString` et `matchWithNumber` sont les solutions à privilégier.

Plus généralement, une donnée métier devrait autant que possible posséder
une identité explicite permettant d'utiliser les outils de discrimination
de DuploJS.

Certaines données externes ne suivent cependant pas cette modélisation.
Une API, une base de données ou une librairie peut fournir des unions
d'objets dont la forme elle-même est la seule manière de distinguer les cas.

`match`, `when` et `whenNot` permettent alors de réaliser une discrimination
par élimination : chaque pattern traite une partie de la donnée et réduit
progressivement les cas restant à résoudre.
 
# Serveur

Un serveur DuploJS est pensé comme un modèle applicatif indépendant du runtime
qui l'exécute.

Le code décrit ses points de contact avec l'environnement à travers des
abstractions communes : exposer une interface HTTP, manipuler des fichiers,
lire la configuration d'exécution ou construire des commandes. Le détail propre
à Node.js, Deno ou Bun reste porté par les connecteurs ou les implémentations
de plateforme.

Cette séparation permet de conserver les mêmes patterns de typage, de
validation et de représentation des erreurs, même lorsque l'application
s'exécute dans des environnements différents. HTTP y occupe une place
centrale, sans réduire le serveur à cette seule feature : les routes
structurent le flux applicatif, tandis que les autres abstractions assurent
le lien avec le runtime.

# Manipuler des fichiers

`ServerFile` regroupe les principales fonctions permettant de manipuler des fichiers, des dossiers, des liens et, plus généralement, le système de fichiers.

Cette API est cross-platform : elle expose une interface commune pour Node.js, Deno et Bun, ce qui permet d'utiliser les mêmes fonctions quel que soit le runtime.

Les opérations sur le système de fichiers peuvent échouer pour de nombreuses raisons : fichier inexistant, permissions insuffisantes, chemin invalide, etc. Pour représenter explicitement ces cas, les fonctions de ServerFile retournent leurs résultats avec `Either`.

### [Manipuler le système de fichiers](ai-docs/src/02-server/10-file/10-manipulation.ts)

Les fonctions de `@duplojs/server/file` suivent toutes une structure similaire :
elles prennent les paramètres nécessaires à l'opération, généralement un ou
plusieurs chemins, puis retournent un `Either`.
 

### [Manipuler des chemins](ai-docs/src/02-server/10-file/20-path.ts)

Le domaine `Path` fournit des contraintes et des fonctions dédiées
à la manipulation des chemins Unix.

Un chemin reste représenté par une `string`, mais la contrainte `Path`
permet de l'identifier explicitement dans le typage et de garantir
qu'il respecte le format attendu.
 
# HTTP

La partie HTTP décrit la manière dont DuploJS structure une application
exposée à travers des routes.

Une application HTTP est organisée autour d'un `Hub`. Il centralise la
configuration, les routes et les plugins, puis délègue le démarrage à un
connecteur propre à la plateforme d'exécution.

Les routes sont décrites comme une succession de steps. Chaque step lit les
données déjà présentes dans le `floor`, peut y ajouter de nouvelles données,
et déclare les réponses qu'elle est capable de produire.

Ce modèle rend explicite le flux d'une requête : extraction des entrées,
validation, vérifications intermédiaires, construction de la réponse finale.
Les `DataStructure` décrivent les données reçues ou renvoyées, tandis que les
`ResponseContract` rendent les sorties possibles visibles dans le typage.

Les routines permettent ensuite de déplacer hors des routes les vérifications
ou enchaînements qui doivent être réutilisés. Elles gardent le même modèle de
steps et de `floor`, mais contrôlent explicitement quelles données peuvent
ressortir vers le flux appelant.

La génération de code s'appuie sur ces déclarations pour produire un contrat
statique partageable avec d'autres services ou applications, sans partager
la codebase qui implémente réellement les routes.


### [Créer une application HTTP](ai-docs/src/02-server/20-http/10-init.ts)

Une application HTTP est organisée autour d'un `Hub`.

Le `Hub` centralise la configuration, les routes et les plugins.
Ces éléments sont indépendants de la plateforme d'exécution.

Certaines fonctionnalités peuvent toutefois nécessiter un environnement
serveur, notamment lorsqu'elles accèdent au système de fichiers.
 

### [Créer une route HTTP](ai-docs/src/02-server/20-http/20-route.ts)

Une route se construit avec `useRouteBuilder` au travers d'une succession
de steps représentées par les méthodes du builder.

Les steps sont exécutées dans leur ordre de déclaration, de haut en bas.
À l'exception de `handler`, elles peuvent être appelées autant de fois
que nécessaire et dans l'ordre souhaité.

Les principales steps sont :
- `extract` : extrait et valide des données de la requête
- `cut` : exécute un bloc intermédiaire propre à la route
- `check` : interprète le résultat d'un checker
- `handler` : clôture la route

Une route n'est enregistrée qu'une fois clôturée par `handler`.

Les steps de vérification (`cut`, `check`, `presetCheck`, `exec`)
sont détaillées dans la partie routine.
 

### [Faire une routine de vérification](ai-docs/src/02-server/20-http/30-routine.ts)

Une vérification est une step qui décide si le flux peut continuer
ou s'arrêter avec une réponse.

Elle peut rester locale au flux avec `cut`, être isolée dans un `checker`,
puis être enchaînée avec d'autres steps dans un `process`.

Les formes changent selon ce qui doit être réutilisé :
- `cut` garde la vérification dans le flux courant
- `checker` isole la logique de vérification
- `presetCheck` réutilise la manière d'interpréter un checker
- `process` réutilise une séquence complète de steps
 

### [Définir une politique de gestion de tokens](ai-docs/src/02-server/20-http/40-jwt.ts)

`@duplojs/json-web-token` organise la gestion des tokens autour d'une politique
définie une seule fois avec un `tokenHandler`.

Cette politique centralise les règles communes aux tokens : durée de vie,
claims attendus, structure du payload et du header, signature et éventuellement
chiffrement.

Le même `tokenHandler` est ensuite réutilisé partout où ces tokens doivent
être créés ou vérifiés.
 

### [Comment partager des ressources](ai-docs/src/02-server/20-http/50-codegen.ts)

`codeGeneratorPlugin` génère à partir des routes les ressources nécessaires
pour les utiliser depuis un autre service.

Il permet notamment de partager le typage des routes et leurs `DataStructure`
sans partager la codebase qui les implémente.

La génération constitue ainsi un contrat statique entre plusieurs services
ou applications, qui peut ensuite servir à construire un client typé.
 
# Environnement

L'environnement représente les ressources et les informations fournies par
la plateforme sur laquelle s'exécute une application.

Cela comprend notamment le système de fichiers, le processus courant,
le dossier de travail, les variables d'environnement ou encore les
fonctionnalités permettant d'exposer un serveur HTTP.

DuploJS fournit des abstractions permettant d'utiliser ces fonctionnalités
sans dépendre directement de l'API propre à Node.js, Deno ou Bun.

Lorsque les plateformes proposent des fonctionnalités suffisamment proches,
elles sont exposées à travers une API commune. Lorsque leurs modèles diffèrent
davantage, l'intégration peut être réalisée à travers un connecteur.


### [Plateformes](ai-docs/src/02-server/30-environment/10-platform.ts)

DuploJS peut fonctionner sur plusieurs plateformes sans exposer directement
leurs API spécifiques dans le reste de l'application.

Selon la fonctionnalité, cette intégration prend deux formes :
une API commune ou un connecteur dédié à la plateforme.
 

### [Manipuler les variables d'environnement](ai-docs/src/02-server/30-environment/20-variable.ts)

`environmentVariable` permet de charger, valider et transformer
des variables d'environnement à partir du système et de fichiers.

La variante `OrThrow` est particulièrement adaptée au chargement
de configuration au démarrage d'une application.
 
# Créer des commandes

`ServerCommand` fournit les outils nécessaires à la création de commandes et de CLI complets.

Une commande peut définir des arguments, des options et leur validation, puis exposer directement ces valeurs typées à son exécution. Les informations déclarées permettent également de générer automatiquement l'aide associée à la commande (--help).

Les commandes peuvent être composées sous forme d'arbre grâce aux sous-commandes, ce qui permet de construire aussi bien une commande simple qu'un CLI plus complexe.

### [Utiliser les commandes](ai-docs/src/02-server/40-command/10-use.ts)

Une commande décrit ses arguments et ses options, puis expose
directement les valeurs interprétées à son callback d'exécution.

La définition sert également à générer automatiquement l'aide et
les erreurs associées à la commande.
 

### [Créer des sous-commandes](ai-docs/src/02-server/40-command/20-sub-command.ts)

Une commande peut utiliser d'autres commandes comme `subjects`.

Cela permet de construire une arborescence de commandes, chaque
sous-commande pouvant elle-même contenir d'autres sous-commandes.

Une commande qui contient des sous-commandes ne peut pas déclarer
d'arguments au même niveau.
 
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
 