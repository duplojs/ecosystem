/**
 * @title DArray.is
 *
 * Vérifier au runtime qu’une valeur est un tableau et affiner son type TypeScript.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

declare const input: DCommon.AnyValue;

// Le test runtime réussit uniquement pour une valeur qui est effectivement un tableau.
if (DArray.is(input)) {
	// Dans cette branche, input est affiné en tableau de valeurs inconnues.
	type _CheckInput = DCommon.ExpectType<typeof input, DCommon.AnyValue[], "strict">;
}

// Dans un pipe, le même predicate unaire fournit le tableau à l’étape de traitement.
const first = DCommon.pipe(
	input,
	DCommon.when(
		DArray.is,
		(array) => {
			type _CheckArray = DCommon.ExpectType<typeof array, DCommon.AnyValue[], "strict">;

			return DArray.first(array);
		},
	),
);
type _CheckFirst = DCommon.ExpectType<typeof first, DCommon.AnyValue | undefined, "strict">;
