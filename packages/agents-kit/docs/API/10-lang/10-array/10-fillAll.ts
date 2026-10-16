/**
 * @title DArray.fillAll
 *
 * Remplacer tous les éléments d’un tableau par une même valeur dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const values = [1, 2, 3];

// Appel classique : tous les éléments deviennent 0.
const result = DArray.fillAll(values, 0);

// La valeur obtenue est [0, 0, 0] ; values reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la valeur de remplacement est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	values,
	DArray.fillAll(9),
);

// La valeur obtenue est [9, 9, 9].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// Le remplissage conserve la borne maximale portée par le tableau source.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.fillAll(constrained, 0);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
