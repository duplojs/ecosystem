/**
 * @title DArray.reduceRight
 *
 * Réduire un tableau de droite à gauche avec le contrat explicite de DArray.reduce.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const values = ["a", "b", "c"];

// Appel classique : les éléments sont visités de la droite vers la gauche.
const result = DArray.reduceRight(values, "", ({ element, lastValue, next }) => next(
	lastValue + element,
));

// La valeur obtenue est "cba".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié : l’accumulateur et le traitement sont configurés dans le pipe.
const piped = DCommon.pipe(
	values,
	DArray.reduceRight("", ({ element, lastValue, next }) => next(
		lastValue + element,
	)),
);

// La valeur obtenue est "cba".
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
