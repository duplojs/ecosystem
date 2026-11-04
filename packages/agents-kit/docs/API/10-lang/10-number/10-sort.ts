/**
 * @title DNumber.sort
 *
 * Trier une copie d’une collection de nombres dans l’ordre croissant ou décroissant.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const values: readonly number[] = [3, 1, 2];
const result = DNumber.sort(values, "ASC");
// La valeur obtenue est une nouvelle collection [1, 2, 3].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

const piped = DCommon.pipe(
	values,
	DNumber.sort("DSC"),
);
// La valeur obtenue est une nouvelle collection [3, 2, 1].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;
