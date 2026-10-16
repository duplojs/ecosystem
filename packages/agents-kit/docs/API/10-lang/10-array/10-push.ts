/**
 * @title DArray.push
 *
 * Ajouter une ou plusieurs valeurs à la fin d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2];

// Appel classique : plusieurs valeurs peuvent être ajoutées en une fois.
const result = DArray.push(numbers, 3, 4);

// La valeur obtenue est [1, 2, 3, 4] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : les valeurs sont configurées dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.push(3),
);

// La valeur obtenue est [1, 2, 3].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// L’ajout augmente d’un élément la borne minimale connue du tableau source.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.push(constrained, 3);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<3>,
	"strict"
>;
