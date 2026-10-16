/**
 * @title DArray.spliceDelete
 *
 * Supprimer une portion d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3, 4];

// Appel classique : supprimer deux éléments à partir de l’index 1.
const result = DArray.spliceDelete(numbers, 1, 2);

// La valeur obtenue est [1, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la portion à supprimer est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.spliceDelete(0, 1),
);

// La valeur obtenue est [2, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// La suppression conserve la borne maximale du tableau source.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.spliceDelete(constrained, 1, 1);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
