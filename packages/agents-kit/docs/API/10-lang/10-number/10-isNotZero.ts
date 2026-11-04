/**
 * @title DNumber.isNotZero
 *
 * Vérifier qu’un nombre est différent de zéro et établir cette contrainte.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte NotZero.
if (DNumber.isNotZero(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.NotZero, "strict">;
}

const result = DNumber.isNotZero(2);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
