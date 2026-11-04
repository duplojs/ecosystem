/**
 * @title DNumber.isNotZero
 *
 * Vérifier qu’un nombre est différent de zéro et établir cette contrainte.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test réussi affine la valeur avec la contrainte NotZero.
if (DNumber.isNotZero(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.NotZero, "strict">;
}

const result = DNumber.isNotZero(2);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le même predicate peut servir d’étape unaire dans un pipe.
const sum = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.isNotZero,
		(number) => {
			type _CheckNumber = DCommon.ExpectType<typeof number, number & DNumber.NotZero, "strict">;

			return DNumber.sum([number]);
		},
	),
);
// La contrainte a servi à accepter l’entrée ; la somme n’en porte pas la preuve.
type _CheckSum = DCommon.ExpectType<typeof sum, number, "strict">;
