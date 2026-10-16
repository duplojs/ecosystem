/**
 * @title DArray.set
 *
 * Remplacer la valeur à un index dans une nouvelle copie du tableau.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : l’index est normalisé comme un index de tableau.
const result = DArray.set(numbers, 1, 20);

// La valeur obtenue est [1, 20, 3] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, number[], "strict">;

// Appel curifié : l’index et la valeur sont fixés dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.set(0, 10),
);

// La valeur obtenue est [10, 2, 3].
type _CheckPiped = DCommon.ExpectType<typeof piped, number[], "strict">;
