/**
 * @title DNumber.isSafe
 *
 * Vérifier qu’un nombre est fini, non-NaN et représentable avec une précision sûre.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Safe.
if (DNumber.isSafe(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Safe, "strict">;
}

const result = DNumber.isSafe(42);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
