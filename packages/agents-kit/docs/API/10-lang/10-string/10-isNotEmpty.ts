/**
 * @title DString.isNotEmpty
 *
 * Vérifier qu'une chaîne contient au moins un caractère.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isNotEmpty(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.NotEmpty, "strict">;
}

const result = DString.isNotEmpty("DuploJS");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le predicate unaire s’utilise aussi dans un pipe pour mesurer la chaîne validée.
const length = DCommon.pipe(
	value,
	DCommon.when(
		DString.isNotEmpty,
		(nonEmpty) => {
			type _CheckValue = DCommon.ExpectType<typeof nonEmpty, string & DString.NotEmpty, "strict">;

			return DString.length(nonEmpty);
		},
	),
);
type _CheckLength = DCommon.ExpectType<typeof length, string | (number & DNumber.Positive), "strict">;
