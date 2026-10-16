/**
 * @title DArray.maxElements
 *
 * Vérifier qu’un tableau contient au plus un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";

declare const values: readonly number[];

// Le test runtime établit une borne supérieure dans la branche réussie.
if (DArray.maxElements(values, 3)) {
	// La valeur d’origine est alors connue comme ayant au plus trois éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.MaxElements<3>,
		"strict"
	>;
}

// La forme curifiée affine l’entrée directement dans le callback de DCommon.when.
const piped = DCommon.pipe(
	values,
	DCommon.when(
		DArray.maxElements(3),
		(array) => {
			type _CheckArray = DCommon.ExpectType<
				typeof array,
				readonly number[] & DArray.MaxElements<3>,
				"strict"
			>;

			return DArray.length(array);
		},
	),
);

// La sortie est la longueur lorsque la borne est respectée, sinon le tableau d’origine.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly number[] | (number & DNumber.Positive & DNumber.LessThanOrEqual<3>),
	"strict"
>;
