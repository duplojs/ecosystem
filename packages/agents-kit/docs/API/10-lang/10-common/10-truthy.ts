/**
 * @title DCommon.truthy
 *
 * Identifier les valeurs truthy et retirer les valeurs falsy de leur union.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | null;
const result = DCommon.truthy(input);

// Le predicate produit un booléen et peut affiner input vers une chaîne.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// L’appel direct affine dans le if ; la branche peut alors transformer la chaîne.
if (DCommon.truthy(input)) {
	type _CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
}

// Une fonction déjà unaire se passe telle quelle à DCommon.when.
const transformed = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.truthy,
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

			return DCommon.forward(value);
		},
	),
);
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | null, "strict">;
