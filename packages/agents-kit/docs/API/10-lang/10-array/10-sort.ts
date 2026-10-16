/**
 * @title DArray.sort
 *
 * Trier une copie du tableau avec une fonction de comparaison.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [3, 1, 2];

// Appel classique : le tri numérique est explicité par la fonction de comparaison.
const result = DArray.sort(numbers, (first, second) => first - second);

// La valeur obtenue est [1, 2, 3] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : la fonction de comparaison est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.sort((first, second) => second - first),
);

// La valeur obtenue est [3, 2, 1].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// Le tri conserve la borne maximale du tableau source.
declare const constrained: readonly number[] & DArray.MaxElements<3>;
const constrainedResult = DArray.sort(constrained, (first, second) => first - second);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<3>,
	"strict"
>;
