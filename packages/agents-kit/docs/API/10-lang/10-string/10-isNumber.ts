/**
 * @title DString.isNumber
 *
 * Vérifier qu'une chaîne représente un nombre et établir cette contrainte dans le type.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isNumber(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Number, "strict">;
}

const result = DString.isNumber("42.5");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le predicate unaire peut aussi s’utiliser directement dans DCommon.when.
const normalized = DCommon.pipe(
	value,
	DCommon.when(
		DString.isNumber,
		(numberString) => {
			type _CheckNumberString = DCommon.ExpectType<typeof numberString, string & DString.Number, "strict">;

			return DString.length(numberString);
		},
	),
);
type _CheckNormalized = DCommon.ExpectType<typeof normalized, string | (number & DNumber.Positive), "strict">;
