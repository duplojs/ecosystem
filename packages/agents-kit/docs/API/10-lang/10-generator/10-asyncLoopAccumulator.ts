/**
 * @title DGenerator.asyncLoopAccumulator
 *
 * Produire une séquence asynchrone en mettant à jour un accumulateur à chaque itération.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const values = await DArray.from(DGenerator.asyncLoopAccumulator(0, async({ accumulator, count, next, exit }) => {
	await DCommon.timeout();

	return count === 3
		? exit(Promise.resolve(accumulator))
		: next(accumulator + 1, Promise.resolve(accumulator));
}));

// La callback et les valeurs émises peuvent être asynchrones ; les sorties sont résolues avant émission.
type _CheckValues = DCommon.ExpectType<typeof values, readonly number[], "strict">;

interface Accumulator {
	readonly total: number;
	readonly previous?: number;
}

const finalTotal = await DArray.from(DGenerator.asyncLoopAccumulator(
	DGenerator.loopAccumulatorFrom<Accumulator>({ total: 0 }),
	async({ accumulator, count, next, exit }) => {
		await DCommon.timeout();

		return count === 2
			? exit(Promise.resolve(accumulator.total))
			: next({
				total: accumulator.total + 1,
				previous: accumulator.total,
			}, Promise.resolve(accumulator.total));
	},
));

type _CheckFinalTotal = DCommon.ExpectType<typeof finalTotal, readonly number[], "strict">;
