/**
 * @title DArray.findIndex
 *
 * Lire l’index du premier élément satisfaisant un prédicat, ou undefined.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 4, 6];

// Appel classique : l’index du premier nombre pair est retourné.
const result = DArray.findIndex(numbers, (value) => value % 2 === 0);

// La valeur obtenue est 1, ou undefined si aucun élément ne convient.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findIndex((value) => value > 5),
);

// La valeur obtenue est 2, ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
