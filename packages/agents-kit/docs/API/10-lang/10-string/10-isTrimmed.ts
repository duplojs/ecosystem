/**
 * @title DString.isTrimmed
 *
 * Vérifier qu'une chaîne ne possède pas d'espace superflu à ses extrémités.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isTrimmed(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Trimmed, "strict">;
	const length = DString.length(value);
	type _CheckLength = DCommon.ExpectType<typeof length, number & DNumber.Positive, "strict">;
}

const result = DString.isTrimmed("DuploJS");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

const length = DCommon.pipe(
	value,
	DCommon.when(
		DString.isTrimmed,
		(trimmed) => {
			type _CheckTrimmed = DCommon.ExpectType<typeof trimmed, string & DString.Trimmed, "strict">;

			return DString.length(trimmed);
		},
	),
);
type _CheckLength = DCommon.ExpectType<typeof length, string | (number & DNumber.Positive), "strict">;
