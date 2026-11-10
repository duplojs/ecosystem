/**
 * @title DCommon.loopAccumulator
 *
 * Répéter une callback synchrone en faisant circuler un accumulateur et retourner la valeur de `exit`.
 */
import * as DCommon from "@duplojs/lang/common";

const total = DCommon.loopAccumulator(0, ({ accumulator, count, next, exit }) => {
	if (count === 3) {
		return exit(accumulator);
	}

	return next(accumulator + count + 1);
});

// Le nombre initial est élargi en number ; chaque `next` fournit l’accumulateur du tour suivant.
type _CheckTotal = DCommon.ExpectType<typeof total, number, "strict">;

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const structuredTotal = DCommon.loopAccumulator(
	DCommon.loopAccumulatorFrom<Accumulator>({ total: 0 }),
	({ accumulator, count, next, exit }) => count === 2
		? exit(accumulator.total)
		: next({
			total: accumulator.total + 1,
			previous: accumulator.total,
		}),
);

// `loopAccumulatorFrom` conserve le type choisi pour un accumulateur structuré.
type _CheckStructuredTotal = DCommon.ExpectType<typeof structuredTotal, number, "strict">;
