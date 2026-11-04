/**
 * @title DPattern.isMatch
 *
 * Vérifier un motif sur une valeur et affiner le type de la partie correspondante.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DObject from "@duplojs/lang/object";
import * as DString from "@duplojs/lang/string";

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

// Littéral : la branche prend la valeur exacte du motif.
declare const status: "ready" | "pending";
if (DPattern.isMatch(status, "ready")) {
	type _CheckStatus = DCommon.ExpectType<typeof status, "ready", "strict">;
	const label = DString.toUpperCase(status);
	// La valeur obtenue est "READY".
	type _CheckLabel = DCommon.ExpectType<typeof label, "READY", "strict">;
}

// Motif imbriqué avec predicate : seules les propriétés demandées sont testées.
declare const packet: {
	data: { value: string | number };
	id: string;
};
if (DPattern.isMatch(packet, { data: { value: DCommon.isType("string") } })) {
	type _CheckPacket = DCommon.ExpectType<typeof packet, {
		data: { value: string };
		id: string;
	}, "strict">;
	const text = DString.toUpperCase(packet.data.value);
	// La sortie est la valeur imbriquée convertie en majuscules.
	type _CheckText = DCommon.ExpectType<typeof text, Uppercase<string>, "strict">;
}

// Un motif tableau vérifie son préfixe et autorise des éléments supplémentaires.
const prefix = DPattern.isMatch(["text", "hello"], ["text"]);
// La valeur obtenue est true ; [] correspondrait à tout tableau, même non vide.
type _CheckPrefix = DCommon.ExpectType<typeof prefix, boolean, "strict">;
