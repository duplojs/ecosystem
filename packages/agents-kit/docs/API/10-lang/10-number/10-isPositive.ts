/**
 * @title DNumber.isPositive
 *
 * Vérifier qu’un nombre est positif ou nul et établir cette contrainte.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte Positive.
if (DNumber.isPositive(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Positive, "strict">;
}

const result = DNumber.isPositive(0);
// La valeur obtenue est true : zéro appartient à cette contrainte.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le même predicate peut servir d’étape unaire dans un pipe.
const sum = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.isPositive,
		(number) => {
			type _CheckNumber = DCommon.ExpectType<typeof number, number & DNumber.Positive, "strict">;

			return DNumber.sum([number]);
		},
	),
);
// La contrainte a servi à accepter l’entrée ; la somme n’en porte pas la preuve.
type _CheckSum = DCommon.ExpectType<typeof sum, number, "strict">;
