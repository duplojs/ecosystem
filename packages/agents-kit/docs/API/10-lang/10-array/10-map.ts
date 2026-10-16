/**
 * @title DArray.map
 *
 * Transformer chaque élément d’un tableau dans une nouvelle collection.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : chaque élément est transformé en chaîne.
const result = DArray.map(numbers, (value) => `number-${value}`);

// La valeur obtenue est ["number-1", "number-2", "number-3"].
type _CheckResult = DCommon.ExpectType<typeof result, readonly string[], "strict">;

// Appel curifié : la transformation est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.map((value) => value * 2),
);

// La valeur obtenue est [2, 4, 6].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// Une transformation qui conserve la cardinalité réapplique la borne maximale.
declare const constrained: readonly number[] & DArray.MaxElements<3>;
const constrainedResult = DArray.map(constrained, (value) => value * 2);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<3>,
	"strict"
>;
