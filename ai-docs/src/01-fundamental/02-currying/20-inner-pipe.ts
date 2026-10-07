/**
 * @title Composition dans une callback.
 *
 * Enchaîner des transformations lorsque la fonction appelante attend une fonction.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

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

