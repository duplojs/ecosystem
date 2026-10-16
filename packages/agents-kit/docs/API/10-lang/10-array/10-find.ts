/**
 * @title DArray.find
 *
 * Lire le premier élément satisfaisant un prédicat, ou undefined si aucun ne convient.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : le premier élément supérieur à 1 est retourné.
const result = DArray.find(numbers, (value) => value > 1);

// La valeur obtenue est 2 ; l’absence d’élément reste représentée par undefined dans le type.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.find((value) => value > 2),
);

// La valeur obtenue est 3, ou undefined si aucun élément ne satisfait le prédicat.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
