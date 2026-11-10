/**
 * @title DGenerator.loopAccumulator
 *
 * Produire une séquence synchrone en mettant à jour un accumulateur à chaque itération.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const values = DArray.from(DGenerator.loopAccumulator(0, ({ accumulator, count, next, exit }) => count === 3
	? exit(accumulator)
	: next(accumulator + 1, accumulator)));

// `next` reçoit d’abord le nouvel accumulateur, puis émet les valeurs suivantes.
// La valeur de `exit` est également émise avant que le générateur se termine.
type _CheckValues = DCommon.ExpectType<typeof values, readonly number[], "strict">;

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const finalTotal = DArray.from(DGenerator.loopAccumulator(
	DGenerator.loopAccumulatorFrom<Accumulator>({ total: 0 }),
	({ accumulator, count, next, exit }) => count === 2
		? exit(accumulator.total)
		: next({
			total: accumulator.total + 1,
			previous: accumulator.total,
		}, accumulator.total),
));

type _CheckFinalTotal = DCommon.ExpectType<typeof finalTotal, readonly number[], "strict">;
