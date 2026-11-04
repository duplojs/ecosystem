/**
 * @title DNumber.sum
 *
 * Additionner les nombres d’une collection.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.sum([3, 1, 2]);
// La valeur obtenue est 6.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const values: readonly number[] = [3, 1, 2];
const piped = DCommon.pipe(
	values,
	DNumber.sum,
);
// La valeur obtenue est la somme de la collection, ici 6.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
