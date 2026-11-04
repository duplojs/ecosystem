/**
 * @title DString.includes
 *
 * Tester si une chaîne contient une sous-chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.includes("hello world", "world");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.includes("world"),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, `${string}world${string}`, "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la chaîne affinée pour calculer sa longueur.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
