/**
 * @title DArray.chunk
 *
 * Découper un tableau en sous-tableaux dont la taille ne dépasse pas la limite donnée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4, 5];

// Appel classique : chaque sous-tableau contient au plus deux éléments.
const result = DArray.chunk(numbers, 2);

// La valeur obtenue est [[1, 2], [3, 4], [5]].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly (readonly number[] & DArray.MinElements<1> & DArray.MaxElements<2>)[],
	"strict"
>;

// Appel curifié : la taille est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.chunk(3),
);

// La valeur obtenue est [[1, 2, 3], [4, 5]].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly (readonly number[] & DArray.MinElements<1> & DArray.MaxElements<3>)[],
	"strict"
>;

// Chaque sous-tableau conserve les contraintes de cardinalité déduites de la taille du chunk.
declare const constrained: readonly number[] & DArray.MinElements<4>;
const constrainedResult = DArray.chunk(constrained, 2);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly (readonly number[] & DArray.MinElements<1> & DArray.MaxElements<2>)[],
	"strict"
>;
