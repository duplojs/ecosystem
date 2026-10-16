/**
 * @title DArray.insert
 *
 * Ajouter une valeur à la fin d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2];

// Appel classique : la valeur est ajoutée sans muter le tableau d’origine.
const result = DArray.insert(3, numbers);

// La valeur obtenue est [1, 2, 3].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Appel curifié : le tableau est fixé avant de fournir la valeur.
const piped = DCommon.pipe(
	3,
	DArray.insert(numbers),
);

// La valeur obtenue est [1, 2, 3].
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[], "strict">;

// La contrainte minimale du tableau source est réappliquée après l’ajout.
declare const constrained: readonly number[] & DArray.MinElements<2>;
const constrainedResult = DArray.insert(3, constrained);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MinElements<2>,
	"strict"
>;
