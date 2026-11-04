/**
 * @title DNumber.maxOf
 *
 * Calculer le maximum d’une collection non vide avec un parcours explicite.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.maxOf([3, 8, 2] as const);
// La valeur obtenue est 8.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const values = [3, 8, 2] as const;
const piped = DCommon.pipe(
	values,
	DNumber.maxOf,
);
// La valeur obtenue est le maximum de la collection, ici 8.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
