/**
 * @title Composition dans une callback.
 *
 * Enchaîner des transformations lorsque la fonction appelante attend une fonction.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import type * as DNumber from "@duplojs/lang/number";

// `innerPipe` permet d'enchaîner plusieurs transformations lorsqu'une
// fonction de transformation est elle-même attendue.
//
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
type _CheckNormalizedTagsWithInnerPipe = DCommon.ExpectType<
	typeof normalizedTagsWithInnerPipe,
	readonly (Lowercase<string> & DString.NotEmpty)[] & DArray.MaxElements<3>,
	"strict"
>;

// `innerPipe` évite de créer une callback intermédiaire uniquement
// pour enchaîner plusieurs transformations.
//
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
type _CheckTagLengths = DCommon.ExpectType<
	typeof tagLengths,
	readonly (number & DNumber.Positive)[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
	"strict"
>;
