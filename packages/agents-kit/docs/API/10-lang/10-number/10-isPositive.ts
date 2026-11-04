/**
 * @title DNumber.isPositive
 *
 * Vérifier qu’un nombre est positif ou nul et établir cette contrainte.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Positive.
if (DNumber.isPositive(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Positive, "strict">;
}

const result = DNumber.isPositive(0);
// La valeur obtenue est true : zéro appartient à cette contrainte.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
