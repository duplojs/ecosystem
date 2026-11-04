/**
 * @title DCommon.or
 *
 * Combiner plusieurs prédicats en une condition satisfaite par au moins l’un d’eux.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const input: string | number | boolean;

// Appel classique : un seul predicate accepté suffit.
const result = DCommon.or(input, [
	DCommon.isType("string"),
	DCommon.isType("number"),
]);
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

if (DCommon.or(input, [DCommon.isType("string"), DCommon.isType("number")])) {
	type _CheckInput = DCommon.ExpectType<typeof input, string | number, "strict">;
}

// Appel curifié : le predicate composé est passé à DCommon.when.
const preserved = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.or([
			DCommon.isType("string"),
			DCommon.isType("number"),
		]),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, string | number, "strict">;

			return DString.to(value);
		},
	),
);

// Les chaînes et les nombres sélectionnés deviennent des chaînes ; le booléen reste inchangé.
type _CheckPreserved = DCommon.ExpectType<
	typeof preserved,
	string | boolean | (string & DString.Number),
	"strict"
>;
