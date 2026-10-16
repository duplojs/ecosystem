/**
 * @title DArray.findLast
 *
 * Lire le dernier élément satisfaisant un prédicat, ou undefined si aucun ne convient.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [2, 3, 4, 6];

// Appel classique : la recherche commence à la fin du tableau.
const result = DArray.findLast(numbers, (value) => value % 2 === 0);

// La valeur obtenue est 6, ou undefined si aucun élément ne convient.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findLast((value) => value < 4),
);

// La valeur obtenue est 3, ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
