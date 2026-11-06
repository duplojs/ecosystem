/**
 * @title DPattern.when
 *
 * Exécuter un traitement lorsque le predicate correspond, en laissant la branche sinon inchangée.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DNumber from "@duplojs/lang/number";

type Input = {
	kind: "number";
	value: number;
} | {
	kind: "text";
	value: string;
};
// Les PatternResult issus d’une étape précédente sont transmis sans nouveau test.
declare const input: Input;
const result = DCommon.pipe(
	input,
	DPattern.when(
		DPattern.isMatch({ kind: "number" }),
		(value) => DNumber.sum([value.value, 1]),
	),
	DPattern.otherwise(
		(value) => value.value,
	),
);
// La branche number fournit son résultat ; otherwise récupère la valeur et traite le cas text.
type _CheckResult = DCommon.ExpectType<typeof result, number | string, "strict">;

// Predicate booléen : le test RegExp ne permet pas d’éliminer une variante du type.
declare const text: string;
const conditional = DCommon.pipe(
	text,
	DPattern.when(
		DString.test(/^ready/),
		DString.toUpperCase,
	),
	DPattern.otherwise(
		DString.toUpperCase,
	),
);
// Les textes commençant par ready sont mis en majuscules ; les autres restent inchangés.
type _CheckConditional = DCommon.ExpectType<typeof conditional, Uppercase<string>, "strict">;
