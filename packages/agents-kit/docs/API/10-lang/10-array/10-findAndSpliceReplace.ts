/**
 * @title DArray.findAndSpliceReplace
 *
 * Remplacer la portion commençant au premier élément satisfaisant un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : remplacer l’élément 2 par [8, 9].
const result = DArray.findAndSpliceReplace(numbers, (value) => value === 2, [8, 9]);

// La valeur obtenue est [1, 8, 9, 3, 4], ou undefined sans correspondance.
type _CheckResult = DCommon.ExpectType<typeof result, number[] | undefined, "strict">;

// Appel curifié : le prédicat et les nouveaux éléments sont configurés dans le pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findAndSpliceReplace((value) => value === 4, [7]),
);

// La valeur obtenue est [1, 2, 3, 7], ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, number[] | undefined, "strict">;
