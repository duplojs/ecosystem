/**
 * @title DArray.every
 *
 * Vérifier que tous les éléments d’un tableau satisfont un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [2, 4, 6];

// Appel classique : tous les éléments sont pairs.
const result = DArray.every(numbers, DNumber.isEven);

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.every(DNumber.isEven),
);

// La valeur obtenue est true.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
