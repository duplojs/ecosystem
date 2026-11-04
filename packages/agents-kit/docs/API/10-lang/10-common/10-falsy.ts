/**
 * @title DCommon.falsy
 *
 * Identifier les valeurs falsy JavaScript avec un narrowing TypeScript.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | null;
const result = DCommon.falsy(input);

// Le prédicat produit un booléen et distingue la branche falsy de l’union.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// L’appel direct expose la branche falsy dans le if.
if (DCommon.falsy(input)) {
	type _CheckInput = DCommon.ExpectType<typeof input, "" | null, "strict">;
}

// Le predicate unaire s’utilise directement avec DCommon.when.
const preserved = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.falsy,
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, "" | null, "strict">;

			return DCommon.forward(value);
		},
	),
);
type _CheckPreserved = DCommon.ExpectType<typeof preserved, string | null, "strict">;
