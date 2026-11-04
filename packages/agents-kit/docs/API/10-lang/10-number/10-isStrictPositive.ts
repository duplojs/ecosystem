/**
 * @title DNumber.isStrictPositive
 *
 * Vérifier qu’un nombre est strictement positif et établir cette contrainte.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte StrictPositive.
if (DNumber.isStrictPositive(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.StrictPositive, "strict">;
}

const result = DNumber.isStrictPositive(1);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le même predicate peut servir d’étape unaire dans un pipe.
const sum = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.isStrictPositive,
		(number) => {
			type _CheckNumber = DCommon.ExpectType<typeof number, number & DNumber.StrictPositive, "strict">;

			return DNumber.sum([number]);
		},
	),
);
// La contrainte a servi à accepter l’entrée ; la somme n’en porte pas la preuve.
type _CheckSum = DCommon.ExpectType<typeof sum, number, "strict">;
