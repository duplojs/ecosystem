/**
 * @title DNumber.isStrictNegative
 *
 * Vérifier qu’un nombre est strictement négatif et établir cette contrainte.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test runtime est strictement négatif.
if (DNumber.isStrictNegative(value)) {
	// Le test runtime est strict ; la signature établit la contrainte Negative exposée par l’API.
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Negative, "strict">;
}

const result = DNumber.isStrictNegative(-1);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
