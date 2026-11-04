/**
 * @title DNumber.betweenThanOrEqual
 *
 * Vérifier qu’un nombre appartient à un intervalle fermé.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const result = DNumber.betweenThanOrEqual(5, 5, 10);
// Appel classique : tester directement une valeur.
// La valeur obtenue est true, car les bornes sont inclusives.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: number;

// Appel curifié : passer le predicate directement à DCommon.when.
const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DNumber.betweenThanOrEqual(5, 10),
		(value) => {
			type _CheckValue = DCommon.ExpectType<
				typeof value,
				number & DNumber.GreaterThanOrEqual<5> & DNumber.LessThanOrEqual<10>,
				"strict"
			>;

			return DNumber.sum([value]);
		},
	),
);
// La valeur est le nombre d’entrée lorsqu’il satisfait l’intervalle.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, number, "strict">;
