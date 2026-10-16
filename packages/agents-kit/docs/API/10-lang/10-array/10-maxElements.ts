/**
 * @title DArray.maxElements
 *
 * Vérifier qu’un tableau contient au plus un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

declare const values: readonly number[];

// Le test runtime établit une borne supérieure dans la branche réussie.
if (DArray.maxElements(values, 3)) {
	// La valeur d’origine est alors connue comme ayant au plus trois éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.MaxElements<3>,
		"strict"
	>;
}
