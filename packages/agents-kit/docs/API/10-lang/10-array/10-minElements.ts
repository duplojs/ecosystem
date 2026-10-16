/**
 * @title DArray.minElements
 *
 * Vérifier qu’un tableau contient au moins un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

declare const values: readonly number[];

// Le test runtime établit une borne inférieure dans la branche réussie.
if (DArray.minElements(values, 2)) {
	// La valeur d’origine est alors connue comme ayant au moins deux éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.MinElements<2>,
		"strict"
	>;
}
