/**
 * @title Fonctions pour pipe
 *
 * L'écosystème DuploJS fournit de nombreuses fonctions conçues pour être
 * directement utilisées dans des `pipe`.
 *
 * Il faut privilégier les fonctions fournies par l'écosystème plutôt que
 * réimplémenter une transformation avec une callback.
 *
 * Avant d'écrire une fonction intermédiaire, il faut rechercher si une
 * fonction curifiée ou directement compatible avec `pipe` existe déjà.
 *
 * Ce principe ne concerne pas uniquement `@duplojs/lang`. Les autres packages
 * de l'écosystème exposent également des fonctions pouvant être composées
 * dans des pipes.
 */
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
