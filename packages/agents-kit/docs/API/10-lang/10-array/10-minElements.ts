/**
 * @title DArray.minElements
 *
 * Vérifier qu’un tableau contient au moins un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";

declare const values: readonly number[];

// Le test runtime établit une borne inférieure dans la branche réussie.
if (DArray.minElements(values, 2)) {
	// La valeur d’origine est alors connue comme ayant au moins deux éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.MinElements<2>,
		"strict"
	>;
}

// La forme curifiée affine l’entrée directement dans le callback de DCommon.when.
const piped = DCommon.pipe(
	values,
	DCommon.when(
		DArray.minElements(2),
		(array) => {
			type _CheckArray = DCommon.ExpectType<
				typeof array,
				readonly number[] & DArray.MinElements<2>,
				"strict"
			>;

			return DArray.length(array);
		},
	),
);

// La sortie est la longueur lorsque la borne est respectée, sinon le tableau d’origine.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly number[] | (number & DNumber.Positive & DNumber.GreaterThanOrEqual<2>),
	"strict"
>;
