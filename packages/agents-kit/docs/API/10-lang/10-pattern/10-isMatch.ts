/**
 * @title DPattern.isMatch
 *
 * Construire un prédicat qui vérifie un motif et affine la valeur correspondante.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DObject from "@duplojs/lang/object";

interface TextInput {
	kind: "text";
	value: string;
}
interface CountInput {
	kind: "count";
	value: number;
}
type Input = TextInput | CountInput;
declare const input: Input;

if (DPattern.isMatch(input, { kind: "text" })) {
	type _CheckInput = DCommon.ExpectType<typeof input, TextInput, "strict">;
	const text = DObject.getProperty(input, "value");
	type _CheckText = DCommon.ExpectType<typeof text, string, "strict">;
}

// En pipe, DCommon.when reçoit le predicate curifié et laisse passer les cas non correspondants.
const selected = DCommon.pipe(
	input,
	DCommon.when(
		DPattern.isMatch({ kind: "count" }),
		(value) => {
			type _CheckCount = DCommon.ExpectType<typeof value, CountInput, "strict">;
			return DObject.getProperty(value, "value");
		},
	),
);
// Le callback retourne le compte ; la variante text traverse le pipe sans être transformée.
type _CheckSelected = DCommon.ExpectType<typeof selected, number | {
	kind: "text";
	value: string;
}, "strict">;
