/**
 * @title DArray.unshift
 *
 * Ajouter une ou plusieurs valeurs au début d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [3, 4];

// Appel classique : les valeurs sont ajoutées dans l’ordre fourni.
const result = DArray.unshift(numbers, 1, 2);

// La valeur obtenue est [1, 2, 3, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : les valeurs sont configurées dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.unshift(1),
);

// La valeur obtenue est [1, 3, 4].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// L’ajout conserve la borne minimale connue du tableau source.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.unshift(constrained, 0);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<2>,
	"strict"
>;
