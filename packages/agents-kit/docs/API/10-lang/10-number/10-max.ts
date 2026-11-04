/**
 * @title DNumber.max
 *
 * Retourner le plus grand nombre d’une collection non vide.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.max([3, 8, 2] as const);
// La valeur obtenue est 8.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const emptySafeInput = [3, 8, 2] as const;
const piped = DCommon.pipe(
	emptySafeInput,
	DNumber.max,
);
// La valeur obtenue est le maximum de la collection, ici 8.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
