/**
 * @title DString.isIn
 *
 * Vérifier qu'une chaîne appartient à une collection de valeurs autorisées.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const values = ["draft", "published"] as const;
const result = DString.isIn("draft", values);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

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
