/**
 * @title DArray.every
 *
 * Vérifier que tous les éléments d’un tableau satisfont un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [2, 4, 6];

// Appel classique : le prédicat reçoit l’élément et son index.
const result = DArray.every(numbers, (value, { index }) => value > index);

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.every((value) => value % 2 === 0),
);

// La valeur obtenue est true.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
