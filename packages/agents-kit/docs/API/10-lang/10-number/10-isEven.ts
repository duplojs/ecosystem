/**
 * @title DNumber.isEven
 *
 * Vérifier qu’un nombre est pair et établir cette contrainte dans le type.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Even.
if (DNumber.isEven(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Even, "strict">;
}

const result = DNumber.isEven(4);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
