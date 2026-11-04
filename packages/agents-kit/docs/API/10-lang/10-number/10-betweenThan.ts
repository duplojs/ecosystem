/**
 * @title DNumber.betweenThan
 *
 * Vérifier qu’un nombre est strictement compris entre deux bornes.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.betweenThan(5, 1, 10);
// Appel classique : tester directement une valeur.
// La valeur obtenue est true, car 5 est strictement entre 1 et 10.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: number;

// Appel curifié : passer le predicate directement à DCommon.when.
const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.betweenThan(1, 10),
		(value) => {
			type _CheckValue = DCommon.ExpectType<
				typeof value,
				number & DNumber.GreaterThan<1> & DNumber.LessThan<10>,
				"strict"
			>;

			return DNumber.sum([value]);
		},
	),
);
// La valeur est le nombre d’entrée lorsqu’il satisfait l’intervalle.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, number, "strict">;
