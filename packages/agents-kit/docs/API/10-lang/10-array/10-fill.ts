/**
 * @title DArray.fill
 *
 * Remplacer une plage d’éléments par une valeur dans une nouvelle copie du tableau.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : les indices 1 et 2 sont remplacés.
const result = DArray.fill(numbers, 0, 1, 3);

// La valeur obtenue est [1, 0, 0, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la valeur et la plage sont fixées dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.fill(9, 0, 2),
);

// La valeur obtenue est [9, 9, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// La borne maximale du tableau source est conservée après le remplacement.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.fill(constrained, 0, 0, 1);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
