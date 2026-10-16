/**
 * @title DArray.reduce
 *
 * Réduire un tableau avec un accumulateur explicite et les sorties next ou exit.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : next transmet l’accumulateur à l’itération suivante.
const result = DArray.reduce(numbers, 0, ({ element, lastValue, next }) => next(
	lastValue + element,
));

// La valeur obtenue est 6.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

// Appel curifié : l’accumulateur et le traitement sont configurés dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.reduce(0, ({ element, lastValue, next }) => next(
		lastValue + element,
	)),
);

// La valeur obtenue est 6.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
