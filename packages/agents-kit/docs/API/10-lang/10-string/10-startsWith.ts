/**
 * @title DString.startsWith
 *
 * Tester si une chaîne commence par une sous-chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.startsWith("user-api", "user");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

if (DString.startsWith(value, "user")) {
	type _CheckIfValue = DCommon.ExpectType<typeof value, `user${string}`, "strict">;
	const length = DString.length(value);
	type _CheckLength = DCommon.ExpectType<typeof length, number & DNumber.Positive, "strict">;
}

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.startsWith("user"),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, `user${string}`, "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la chaîne affinée pour calculer sa longueur.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
