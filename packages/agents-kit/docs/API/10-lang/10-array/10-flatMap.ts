/**
 * @title DArray.flatMap
 *
 * Transformer chaque élément puis aplatir le niveau de tableau produit.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : chaque nombre produit sa valeur et son double.
const result = DArray.flatMap(numbers, (value) => [value, value * 2]);

// La valeur obtenue est [1, 2, 2, 4, 3, 6].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la transformation est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.flatMap((value) => [value * 10]),
);

// La valeur obtenue est [10, 20, 30].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;
