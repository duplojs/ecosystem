/**
 * @title DNumber.max
 *
 * Retourner le plus grand nombre d’une collection non vide.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const values: readonly [3, 8, 2];
const result = DNumber.max(values);
// La valeur obtenue est 8.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const piped = DCommon.pipe(
	values,
	DNumber.max,
);
// La valeur obtenue est le maximum de la collection, ici 8.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
