/**
 * @title DNumber.min
 *
 * Retourner le plus petit nombre d’une collection non vide.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.min([3, 1, 8] as const);
// La valeur obtenue est 1.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const values = [3, 1, 8] as const;
const piped = DCommon.pipe(
	values,
	DNumber.min,
);
// La valeur obtenue est le minimum de la collection, ici 1.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
