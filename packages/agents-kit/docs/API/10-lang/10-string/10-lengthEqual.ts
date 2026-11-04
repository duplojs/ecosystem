/**
 * @title DString.lengthEqual
 *
 * Tester ou établir qu'une chaîne possède exactement un nombre donné de caractères.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.lengthEqual("Duplo", 5);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

if (DString.lengthEqual(value, 5)) {
	type _CheckIfValue = DCommon.ExpectType<typeof value, string & DString.LengthEqual<5>, "strict">;
	const length = DString.length(value);
	type _CheckLength = DCommon.ExpectType<typeof length, number & DNumber.Positive, "strict">;
}

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.lengthEqual(5),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, string & DString.LengthEqual<5>, "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la longueur exacte établie par le predicate.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
