/**
 * @title DNumber.isStrictNegative
 *
 * Vérifier qu’un nombre est strictement négatif et établir cette contrainte.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

declare const value: number;

// Appel classique : le test runtime est strictement négatif.
if (DNumber.isStrictNegative(value)) {
	// Le test runtime est strict ; la signature établit la contrainte Negative exposée par l’API.
	type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Negative, "strict">;
}

const result = DNumber.isStrictNegative(-1);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le même predicate peut servir d’étape unaire dans un pipe.
const sum = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.isStrictNegative,
		(number) => {
			type _CheckNumber = DCommon.ExpectType<typeof number, number & DNumber.Negative, "strict">;

			return DNumber.sum([number]);
		},
	),
);
// La contrainte a servi à accepter l’entrée ; la somme n’en porte pas la preuve.
type _CheckSum = DCommon.ExpectType<typeof sum, number, "strict">;
