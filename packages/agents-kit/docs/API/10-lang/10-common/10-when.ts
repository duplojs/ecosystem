/**
 * @title DCommon.when
 *
 * Transformer une valeur uniquement lorsqu’un prédicat est satisfait.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const input: string | number;

// Appel classique : donner la valeur avant le predicate.
const result = DCommon.when(
	input,
	DCommon.isType("string"),
	DString.toUpperCase,
);
type _CheckResult = DCommon.ExpectType<typeof result, number | Uppercase<string>, "strict">;

// Appel curifié : l’étape configurée est directement placée dans DCommon.pipe.
const piped = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.isType("string"),
		DString.toUpperCase,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number | Uppercase<string>, "strict">;
