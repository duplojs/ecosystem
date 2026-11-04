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
	DPattern.when(DPattern.isMatch({ kind: "number" }), (value) => DNumber.sum([value.value, 1])),
	DPattern.otherwise((value) => value.value),
);
// La branche number fournit son résultat ; otherwise récupère la valeur et traite le cas text.
type _CheckResult = DCommon.ExpectType<typeof result, number | string, "strict">;

// La forme directe accepte également la valeur avant le predicate et le callback.
// La branche number fournit le nombre doublé ; text reste non traité.
const direct = DPattern.when(
	input,
	DPattern.isMatch({ kind: "number" }),
	(value) => DNumber.sum([value.value, value.value]),
);
type _CheckDirect = DCommon.ExpectType<typeof direct, DPattern.PatternResult<number> | {
	kind: "text";
	value: string;
}, "strict">;

// Predicate booléen : le test RegExp ne permet pas d’éliminer une variante du type.
declare const text: string;
const conditional = DPattern.when(text, DString.test(/^ready/), DString.toUpperCase);
// Les textes commençant par ready sont mis en majuscules ; les autres restent inchangés.
// Le cas string reste non traité dans les types : terminer avec otherwise.
type _CheckConditional = DCommon.ExpectType<typeof conditional, string | DPattern.PatternResult<Uppercase<string>>, "strict">;
