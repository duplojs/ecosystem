/**
 * @title DPattern.when
 *
 * Exécuter un traitement lorsque le predicate correspond, en laissant la branche sinon inchangée.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

type Input = {
	kind: "number";
	value: number;
} | {
	kind: "text";
	value: string;
};
declare const input: Input;
const result = DCommon.pipe(
	input,
	DPattern.when(DPattern.isMatch({ kind: "number" }), (value) => DNumber.sum([value.value, 1])),
	DPattern.otherwise((value) => value.value),
);
// La branche number fournit son résultat ; otherwise récupère la valeur et traite le cas text.
type _CheckResult = DCommon.ExpectType<typeof result, number | string, "strict">;

// La forme directe accepte également la valeur avant le predicate et le callback.
const direct = DPattern.when(
	input,
	DPattern.isMatch({ kind: "number" }),
	(value) => value.value * 2,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, DPattern.PatternResult<number> | {
	kind: "text";
	value: string;
}, "strict">;
