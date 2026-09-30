/**
 * @title Utilisation de la currification.
 *
 * Dans DuploJS, la manière privilégiée de manipuler de la donnée est
 * d'utiliser les fonctions curifiées dans des `pipe`.
 *
 * La donnée traverse successivement les fonctions du pipe. Les fonctions
 * curifiées permettent de configurer une opération sans fournir immédiatement
 * la donnée qu'elle devra manipuler.
 *
 * Il faut privilégier cette façon de composer les fonctions de l'écosystème.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// Les fonctions curifiées sont directement utilisées comme étapes du pipe.
// readonly (Lowercase<string> & DString.MinCharacters<1>)[] & DArray.MaxElements<3>
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	DString.split(","),
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);

// `innerPipe` permet d'enchaîner plusieurs transformations directement
// à l'endroit où une callback est attendue.
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

// Cela évite de déclarer une callback contenant elle-même un `pipe`.
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

// `asyncPipe` applique le même principe avec des étapes synchrones
// ou asynchrones.
// Promise<readonly Lowercase<string>[] & DArray.LengthEqual<2> & DArray.MinElements<2> & DArray.MaxElements<2>>
const asyncTags = DCommon.asyncPipe(
	Promise.resolve(" TypeScript, DuploJS " as const),
	DString.split(","),
	DArray.map(DString.trim),
	(tags) => Promise.resolve(tags),
	DArray.map(DString.toLowerCase),
);

// `asyncInnerPipe` permet d'enchaîner plusieurs opérations asynchrones
// directement là où une callback est attendue.
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
