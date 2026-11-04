/**
 * @title DString.isNotEmpty
 *
 * Vérifier qu'une chaîne contient au moins un caractère.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isNotEmpty(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.NotEmpty, "strict">;
}

const result = DString.isNotEmpty("DuploJS");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
