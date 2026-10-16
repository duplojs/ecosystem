/**
 * @title DCommon.or
 *
 * Combiner plusieurs prédicats en une condition satisfaite par au moins l’un d’eux.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | number;

// Appel classique : un seul predicate accepté suffit.
const result = DCommon.or(input, [
	DCommon.isType("string"),
	DCommon.isType("number"),
]);
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : le predicate composé est passé à DCommon.when.
const preserved = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.or([
			DCommon.isType("string"),
			DCommon.isType("number"),
		]),
		DCommon.forward,
	),
);

type _CheckPreserved = DCommon.ExpectType<typeof preserved, string | number, "strict">;
