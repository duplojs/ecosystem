/**
 * @title DNumber.isOdd
 *
 * Vérifier qu’un nombre est impair et établir cette contrainte dans le type.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Odd.
if (DNumber.isOdd(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Odd, "strict">;
}

const result = DNumber.isOdd(3);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
