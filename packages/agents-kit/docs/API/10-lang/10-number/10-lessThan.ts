/**
 * @title DNumber.lessThan
 *
 * Tester ou établir qu’un nombre est strictement inférieur à une borne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.lessThan(3, 5);
// Appel classique : tester directement une valeur.
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: number;

if (DNumber.lessThan(value, 5)) {
	type _CheckIfValue = DCommon.ExpectType<typeof value, number & DNumber.LessThan<5>, "strict">;
	const sum = DNumber.sum([value]);
	type _CheckSum = DCommon.ExpectType<typeof sum, number, "strict">;
}

// Appel curifié : passer le predicate directement à DCommon.when.
const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.lessThan(5),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.LessThan<5>, "strict">;

			return DNumber.sum([value]);
		},
	),
);
// La valeur est le nombre d’entrée lorsqu’il est inférieur à 5.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, number, "strict">;
