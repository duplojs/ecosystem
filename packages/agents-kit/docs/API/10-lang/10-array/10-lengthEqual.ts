/**
 * @title DArray.lengthEqual
 *
 * Vérifier qu’un tableau possède exactement un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

declare const values: readonly number[];

// Le test runtime établit la longueur exacte dans la branche réussie.
if (DArray.lengthEqual(values, 2)) {
	// La valeur d’origine est alors connue comme ayant exactement deux éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.LengthEqual<2>,
		"strict"
	>;
}
