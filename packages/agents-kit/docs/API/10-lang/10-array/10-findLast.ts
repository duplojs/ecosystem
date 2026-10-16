/**
 * @title DArray.findLast
 *
 * Lire le dernier élément satisfaisant un prédicat, ou undefined si aucun ne convient.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [2, 3, 4, 6];

// Appel classique : la recherche commence à la fin du tableau.
const result = DArray.findLast(numbers, DNumber.isEven);

// La valeur obtenue est 6, ou undefined si aucun élément ne convient.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	(number & DNumber.Even) | undefined,
	"strict"
>;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findLast(DNumber.lessThan(4)),
);

// La valeur obtenue est 3, ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	(number & DNumber.LessThan<4>) | undefined,
	"strict"
>;
