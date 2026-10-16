/**
 * @title DArray.findLastIndex
 *
 * Lire l’index du dernier élément satisfaisant un prédicat, ou undefined.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [2, 3, 4, 6];

// Appel classique : l’index du dernier nombre pair est retourné.
const result = DArray.findLastIndex(numbers, DNumber.isEven);

// La valeur obtenue est 3, ou undefined si aucun élément ne convient.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findLastIndex(DNumber.lessThan(5)),
);

// La valeur obtenue est 2, ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
