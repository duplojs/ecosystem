/**
 * @title DGenerator.loopAccumulatorFrom
 *
 * Marquer une valeur initiale pour fixer précisément le type de l’accumulateur d’une boucle.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const initialAccumulator = DGenerator.loopAccumulatorFrom<Accumulator>({ total: 0 });

type _CheckInitialAccumulator = DCommon.ExpectType<
	typeof initialAccumulator,
	DGenerator.LoopAccumulatorFromResult<Accumulator>,
	"strict"
>;

const result = DGenerator.loopAccumulator(initialAccumulator, ({ accumulator, count, next, exit }) => count === 2
	? exit(accumulator.total)
	: next({
		total: accumulator.total + 1,
		previous: accumulator.total,
	}, accumulator.total));

// La boucle reçoit Accumulator comme état, tout en produisant sa valeur de sortie dans le générateur.
type _CheckResult = DCommon.ExpectType<typeof result, Generator<number, unknown, unknown>, "strict">;
