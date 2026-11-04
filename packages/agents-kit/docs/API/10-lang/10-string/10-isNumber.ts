/**
 * @title DString.isNumber
 *
 * Vérifier qu'une chaîne représente un nombre et établir cette contrainte dans le type.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isNumber(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Number, "strict">;
}

const result = DString.isNumber("42.5");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
