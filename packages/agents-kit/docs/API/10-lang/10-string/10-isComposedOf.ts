/**
 * @title DString.isComposedOf
 *
 * Vérifier qu'une chaîne ne contient que des caractères appartenant à une ou plusieurs plages.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.isComposedOf("abc123", ["a-z", "0-9"]);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.isComposedOf("a-z"),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, string & DString.AllowedCharacters<"a-z">, "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la chaîne affinée pour calculer sa longueur.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
