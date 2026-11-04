/**
 * @title Réutilisation des fonctions de l’écosystème dans les pipes.
 *
 * Composer les opérations fournies, sous forme curifiée ou directement compatible avec pipe.
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

// Avant d’écrire une callback ou de recourir à une API native, rechercher une opération
// fournie par l’écosystème : sa forme curifiée ou son unique argument peut convenir au pipe.
// Cette démarche s’applique à tous les packages ; les domaines ci-dessous sont des exemples.

// Les fonctions de `string` et `array` sont faites pour être composées.
const normalizedNames = DCommon.pipe(
	[" John ", "", " JANE ", " Alice "],
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
	DArray.sort(DString.sortCompare),
);
type _CheckNormalizedNames = DCommon.ExpectType<
	typeof normalizedNames,
	readonly (Lowercase<string> & DString.MinCharacters<1>)[] & DArray.MaxElements<4>,
	"strict"
>;

// Les prédicats de `number` peuvent directement être utilisés
// dans les fonctions de manipulation de tableaux.
const adultAges = DCommon.pipe(
	[12, 18, 42, 8, 21],
	DArray.filter(DNumber.greaterThanOrEqual(18)),
	DNumber.sum,
);
type _CheckAdultAges = DCommon.ExpectType<typeof adultAges, number, "strict">;

// Les fonctions de `object` sont également prévues pour le pipe.
const publicUser = DCommon.pipe(
	{
		name: " John ",
		password: "secret",
		age: 24,
	},
	DObject.transformProperty("name", DString.trim),
	DObject.omit(["password"]),
);
type _CheckPublicUser = DCommon.ExpectType<
	typeof publicUser,
	{
		name: string & DString.Trimmed & DString.MaxCharacters<6>;
		readonly age: 24;
	},
	"strict"
>;

// `innerPipe` permet de composer plusieurs fonctions intégrées
// directement à l'endroit où une callback est attendue.
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
type _CheckUsers = DCommon.ExpectType<
	typeof users,
	readonly { name: Lowercase<string> }[] & DArray.LengthEqual<2>,
	"strict"
>;

// Les fonctions `Either` sont elles aussi composables avec les pipes.
declare const maybeName:
	| DEither.Right<"user-found", string>
	| DEither.Left<"user-not-found">;

const name = DCommon.pipe(
	maybeName,
	DEither.unwrapOr("anonymous"),
	DString.trim,
	DString.toLowerCase,
);
type _CheckName = DCommon.ExpectType<typeof name, Lowercase<string>, "strict">;

// `Either` possède également ses propres pipes lorsque le traitement
// doit continuer uniquement sur une valeur `Right`.
const normalizedEitherName = DEither.rightPipe(
	maybeName,
	DString.trim,
	DString.toLowerCase,
);
type _CheckNormalizedEitherName = DCommon.ExpectType<typeof normalizedEitherName, DEither.Left<"user-not-found", unknown> | DEither.Success<Lowercase<string>>, "strict">;

// Les tuples disposent eux aussi de fonctions curifiées.
const normalizedTuple = DCommon.pipe(
	[" John ", " Jane "] as const,
	DTuple.map(DString.trim),
);
type _CheckNormalizedTuple = DCommon.ExpectType<typeof normalizedTuple, readonly [string & DString.Trimmed & DString.MaxCharacters<6>, string & DString.Trimmed & DString.MaxCharacters<6>], "strict">;

// Les generators permettent de construire des transformations lazy
// avec exactement le même modèle de composition.
const generatedNames = DCommon.pipe(
	[" John ", "", " JANE ", " Alice "],
	DGenerator.map(DString.trim),
	DGenerator.filter(DString.isNotEmpty),
	DGenerator.map(DString.toLowerCase),
	DArray.from,
);
type _CheckGeneratedNames = DCommon.ExpectType<typeof generatedNames, readonly (Lowercase<string> & DString.MinCharacters<1>)[], "strict">;

// Les fonctions de date peuvent être utilisées directement dans les pipes.
declare const creationDate: DChrono.TheDate;

const serializedCreationDate = DCommon.pipe(
	creationDate,
	DChrono.formatDate(
		"YYYY-MM-DD HH:mm:ss",
		"Europe/Paris",
	),
);
type _CheckSerializedCreationDate = DCommon.ExpectType<typeof serializedCreationDate, string, "strict">;

// Le pattern matching fournit également des fonctions curifiées.
declare const status: "draft" | "published" | "archived";

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
type _CheckStatusLabel = DCommon.ExpectType<typeof statusLabel, "Draft" | "Published" | "Archived", "strict">;

// Les fonctions n'ont pas besoin d'être curifiées lorsqu'elles reçoivent
// déjà la donnée comme unique argument : elles peuvent être utilisées
// directement comme étape du pipe.
declare const filePath: string & DPath.Path;

const fileContent = await DCommon.asyncPipe(
	filePath,
	DSFile.readTextFile,
	DEither.unwrapOr(""),
	DString.trim,
);
type _CheckFileContent = DCommon.ExpectType<typeof fileContent, string & DString.Trimmed, "strict">;

// Les fonctions curifiées existent également dans `@duplojs/server`.
const writeResult = await DCommon.asyncPipe(
	filePath,
	DSFile.writeTextFile("Hello world"),
);
type _CheckWriteResult = DCommon.ExpectType<typeof writeResult, DSFile.WriteTextFileResult, "strict">;

// Cela permet de composer des traitements provenant de plusieurs packages.
const jsonContent = await DCommon.asyncPipe(
	filePath,
	DSFile.readJsonFile,
	DEither.unwrapOr({}),
);
type _CheckJsonContent = DCommon.ExpectType<typeof jsonContent, DCommon.Json | {}, "strict">;
