/**
 * @title DCommon.asyncLoopAccumulator
 *
 * Répéter une callback asynchrone en faisant circuler un accumulateur et retourner la valeur de `exit`.
 */
import * as DCommon from "@duplojs/lang/common";

const total = await DCommon.asyncLoopAccumulator(0, async({ accumulator, count, next, exit }) => {
	await DCommon.timeout();

	if (count === 3) {
		return exit(accumulator);
	}

	return next(accumulator + count + 1);
});

// La callback est attendue à chaque tour et le résultat final est celui de `exit`.
type _CheckTotal = DCommon.ExpectType<typeof total, number, "strict">;

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const structuredTotal = await DCommon.asyncLoopAccumulator(
	DCommon.loopAccumulatorFrom<Accumulator>({ total: 0 }),
	async({ accumulator, count, next, exit }) => {
		await DCommon.timeout();

		return count === 2
			? exit(accumulator.total)
			: next({
				total: accumulator.total + 1,
				previous: accumulator.total,
			});
	},
);

type _CheckStructuredTotal = DCommon.ExpectType<typeof structuredTotal, number, "strict">;
