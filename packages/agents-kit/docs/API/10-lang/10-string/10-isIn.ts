/**
 * @title DString.isIn
 *
 * Vérifier qu'une chaîne appartient à une collection de valeurs autorisées.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

declare const values: readonly ["draft", "published"];
const result = DString.isIn("draft", values);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

if (DString.isIn(value, values)) {
	type _CheckIfValue = DCommon.ExpectType<typeof value, "draft" | "published", "strict">;
	const length = DString.length(value);
	type _CheckLength = DCommon.ExpectType<typeof length, number & DNumber.Positive, "strict">;
}

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.isIn(values),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, "draft" | "published", "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la valeur réduite à l'union autorisée.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
