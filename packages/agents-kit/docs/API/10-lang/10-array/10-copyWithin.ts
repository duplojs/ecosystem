/**
 * @title DArray.copyWithin
 *
 * Copier une portion d’un tableau vers une autre position dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : copier les éléments [2, 3] à partir de l’index 0.
const result = DArray.copyWithin(numbers, 0, 1, 3);

// La valeur obtenue est [2, 3, 3, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la cible et la plage sont fixées dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.copyWithin(0, 1, 3),
);

// La valeur obtenue est [2, 3, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// Une borne maximale connue est conservée par la copie transformée.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.copyWithin(constrained, 0, 1);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
