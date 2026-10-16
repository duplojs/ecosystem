/**
 * @title DArray.prepend
 *
 * Ajouter les éléments d’un ou plusieurs tableaux au début sans muter le tableau d’entrée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [3, 4];

// Appel classique : les tableaux fournis sont placés avant numbers.
const result = DArray.prepend(numbers, [1], [2]);

// La valeur obtenue est [1, 2, 3, 4].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : les éléments à ajouter sont fixés dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.prepend([1, 2]),
);

// La valeur obtenue est [1, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// La contrainte minimale du tableau source est réappliquée après l’ajout au début.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.prepend(constrained, [1]);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<2>,
	"strict"
>;
