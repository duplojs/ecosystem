/**
 * @title DArray.findAndSpliceInsert
 *
 * Insérer des éléments avant le premier élément satisfaisant un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 3, 4];

// Appel classique : insérer [2] avant le premier élément supérieur à 1.
const result = DArray.findAndSpliceInsert(numbers, (value) => value > 1, [2]);

// La valeur obtenue est [1, 2, 3, 4], ou undefined si aucun élément ne correspond.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[] | undefined, "strict">;

// Appel curifié : le prédicat et les éléments sont configurés dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findAndSpliceInsert((value) => value === 4, [3]),
);

// La valeur obtenue est [1, 3, 3, 4], ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[] | undefined, "strict">;

// L’insertion conserve la borne minimale du tableau source, avec l’absence si aucun élément ne correspond.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.findAndSpliceInsert(constrained, (value) => value > 1, [0]);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	(readonly number[] & DArray.MinElements<2>) | undefined,
	"strict"
>;
