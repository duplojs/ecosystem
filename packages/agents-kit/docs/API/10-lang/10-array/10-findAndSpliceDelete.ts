/**
 * @title DArray.findAndSpliceDelete
 *
 * Supprimer plusieurs éléments à partir du premier élément satisfaisant un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [1, 2, 3, 4];

// Appel classique : supprimer deux éléments à partir du premier nombre pair.
const result = DArray.findAndSpliceDelete(numbers, DNumber.isEven, 2);

// La valeur obtenue est [1, 4], ou undefined si aucun élément ne correspond.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[] | undefined, "strict">;

// Appel curifié : le prédicat et le nombre de suppressions sont configurés dans le pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findAndSpliceDelete(DNumber.greaterThan(1), 1),
);

// La valeur obtenue est [1, 3, 4], ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[] | undefined, "strict">;

// La suppression conserve une borne maximale existante, avec l’absence si aucun élément ne correspond.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.findAndSpliceDelete(constrained, DNumber.greaterThan(1), 1);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	(readonly number[] & DArray.MaxElements<4>) | undefined,
	"strict"
>;
