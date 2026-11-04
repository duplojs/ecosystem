/**
 * @title DNumber.greaterThan
 *
 * Tester ou établir qu’un nombre est strictement supérieur à une borne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.greaterThan(8, 5);
// Appel classique : tester directement une valeur.
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: number;

// Appel curifié : passer le predicate directement à DCommon.when.
const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.greaterThan(5),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.GreaterThan<5>, "strict">;

			return DNumber.sum([value]);
		},
	),
);
// La valeur est le nombre d’entrée lorsqu’il est supérieur à 5.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, number, "strict">;
