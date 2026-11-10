/**
 * @title DCommon.loopAccumulatorFrom
 *
 * Marquer une valeur initiale pour fixer précisément le type de l’accumulateur d’une boucle.
 */
import * as DCommon from "@duplojs/lang/common";

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const initialAccumulator = DCommon.loopAccumulatorFrom<Accumulator>({ total: 0 });

type _CheckInitialAccumulator = DCommon.ExpectType<
	typeof initialAccumulator,
	DCommon.LoopAccumulatorFromResult<Accumulator>,
	"strict"
>;

const result = DCommon.loopAccumulator(initialAccumulator, ({ accumulator, count, next, exit }) => count === 2
	? exit(accumulator.total)
	: next({
		total: accumulator.total + 1,
		previous: accumulator.total,
	}));

// La boucle reçoit Accumulator comme état et retourne le nombre fourni à `exit`.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;
