/**
 * @title DNumber.minOf
 *
 * Calculer le minimum d’une collection non vide avec un parcours explicite.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const values: readonly [3, 1, 8];
const result = DNumber.minOf(values);
// La valeur obtenue est 1.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const piped = DCommon.pipe(
	values,
	DNumber.minOf,
);
// La valeur obtenue est le minimum de la collection, ici 1.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
