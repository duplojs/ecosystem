/**
 * @title DArray.spliceInsert
 *
 * Insérer des éléments à un index dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 4];

// Appel classique : insérer [2, 3] avant l’index 1.
const result = DArray.spliceInsert(numbers, 1, [2, 3]);

// La valeur obtenue est [1, 2, 3, 4].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : l’index et les éléments sont configurés dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.spliceInsert(1, [2, 3]),
);

// La valeur obtenue est [1, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// L’insertion réapplique la contrainte minimale du tableau source.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.spliceInsert(constrained, 1, [8]);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<2>,
	"strict"
>;
