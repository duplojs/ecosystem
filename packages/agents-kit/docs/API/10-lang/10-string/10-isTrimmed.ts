/**
 * @title DString.isTrimmed
 *
 * Vérifier qu'une chaîne ne possède pas d'espace superflu à ses extrémités.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isTrimmed(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Trimmed, "strict">;
}

const result = DString.isTrimmed("DuploJS");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
