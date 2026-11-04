/**
 * @title DNumber.isInteger
 *
 * Vérifier qu’un nombre est entier et établir cette contrainte dans le type.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Integer.
if (DNumber.isInteger(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Integer, "strict">;
}

const result = DNumber.isInteger(4);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
