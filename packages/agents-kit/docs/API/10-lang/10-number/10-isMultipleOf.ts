/**
 * @title DNumber.isMultipleOf
 *
 * Tester ou établir qu’un nombre est un multiple d’une valeur donnée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.isMultipleOf(12, 3);
// Appel classique : tester directement une valeur.
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: number;

// Appel curifié : passer le predicate directement à DCommon.when.
const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.isMultipleOf(3),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, number & DNumber.MultipleOf<3>, "strict">;

			return DNumber.sum([value]);
		},
	),
);
// La valeur est le nombre d’entrée lorsqu’il est multiple de 3.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, number, "strict">;
