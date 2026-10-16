/**
 * @title DArray.lengthEqual
 *
 * Vérifier qu’un tableau possède exactement un nombre donné d’éléments et établir cette contrainte.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

declare const values: readonly number[];

// Le test runtime établit la longueur exacte dans la branche réussie.
if (DArray.lengthEqual(values, 2)) {
	// La valeur d’origine est alors connue comme ayant exactement deux éléments.
	type _CheckValues = DCommon.ExpectType<
		typeof values,
		readonly number[] & DArray.LengthEqual<2>,
		"strict"
	>;
}

// La forme curifiée affine l’entrée directement dans le callback de DCommon.when.
const piped = DCommon.pipe(
	values,
	DCommon.when(
		DArray.lengthEqual(2),
		(array) => {
			type _CheckArray = DCommon.ExpectType<
				typeof array,
				readonly number[] & DArray.LengthEqual<2>,
				"strict"
			>;

			return DArray.first(array);
		},
	),
);

// La sortie est le premier nombre lorsque la longueur vaut 2, sinon le tableau d’origine.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | readonly number[], "strict">;
