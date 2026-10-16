/**
 * @title DArray.slice
 *
 * Extraire une portion d’un tableau dans une nouvelle collection.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : les bornes suivent les règles de Array.prototype.slice.
const result = DArray.slice(numbers, 1, 3);

// La valeur obtenue est [2, 3].
type _CheckResult = DCommon.ExpectType<typeof result, number[], "strict">;

// Appel curifié : les bornes sont fixées dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.slice(1, 3),
);

// La valeur obtenue est [2, 3].
type _CheckPiped = DCommon.ExpectType<typeof piped, number[], "strict">;
