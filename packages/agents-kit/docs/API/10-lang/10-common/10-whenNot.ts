/**
 * @title DCommon.whenNot
 *
 * Transformer une valeur uniquement lorsqu’un prédicat n’est pas satisfait.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | number;

// Appel classique : transformer seulement la branche qui ne satisfait pas le predicate.
const result = DCommon.whenNot(
	input,
	DCommon.isType("string"),
	DCommon.forward,
);
type _CheckResult = DCommon.ExpectType<typeof result, string | number, "strict">;

// Appel curifié : placer le traitement conditionnel dans un pipe.
const piped = DCommon.pipe(
	input,
	DCommon.whenNot(
		DCommon.isType("string"),
		DCommon.forward,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string | number, "strict">;
