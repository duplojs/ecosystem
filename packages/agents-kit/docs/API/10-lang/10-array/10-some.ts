/**
 * @title DArray.some
 *
 * Vérifier qu’au moins un élément d’un tableau satisfait un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 3, 4];

// Appel classique : le prédicat trouve un nombre pair.
const result = DArray.some(numbers, (value) => value % 2 === 0);

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.some((value) => value > 4),
);

// La valeur obtenue est false.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
