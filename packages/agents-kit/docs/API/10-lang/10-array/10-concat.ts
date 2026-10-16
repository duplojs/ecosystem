/**
 * @title DArray.concat
 *
 * Ajouter les éléments d’un ou plusieurs tableaux à la fin sans muter le tableau d’entrée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2];

// Appel classique : les tableaux sont fusionnés dans une nouvelle collection.
const result = DArray.concat(numbers, [3], [4, 5]);

// La valeur obtenue est [1, 2, 3, 4, 5] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : les éléments fixes sont fournis dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.concat([3, 4]),
);

// La valeur obtenue est [1, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// La contrainte minimale du tableau source est réappliquée au résultat.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.concat(constrained, [3]);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<2>,
	"strict"
>;
