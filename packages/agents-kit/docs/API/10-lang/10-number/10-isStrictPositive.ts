/**
 * @title DNumber.isStrictPositive
 *
 * Vérifier qu’un nombre est strictement positif et établir cette contrainte.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte StrictPositive.
if (DNumber.isStrictPositive(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.StrictPositive, "strict">;
}

const result = DNumber.isStrictPositive(1);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
