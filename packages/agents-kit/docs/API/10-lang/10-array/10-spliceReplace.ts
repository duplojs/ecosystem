/**
 * @title DArray.spliceReplace
 *
 * Remplacer une portion d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : remplacer deux éléments à partir de l’index 1.
const result = DArray.spliceReplace(numbers, 1, [8, 9]);

// La valeur obtenue est [1, 8, 9, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, number[], "strict">;

// Appel curifié : l’index et les éléments de remplacement sont configurés dans le pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.spliceReplace(0, [7]),
);

// La valeur obtenue est [7, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, number[], "strict">;
