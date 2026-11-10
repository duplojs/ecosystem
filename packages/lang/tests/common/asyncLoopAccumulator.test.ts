import * as DCommon from "@scripts/common";

describe("asyncLoopAccumulator", () => {
	it("updates the accumulator and returns the exit value", async() => {
		const observer = vi.fn();
		const result = DCommon.asyncLoopAccumulator(0, async({ accumulator, count, next, exit }) => {
			observer(accumulator);

			return count === 3
				? exit(`done-${accumulator}`)
				: next(accumulator + 1);
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<`done-${number}`>, "strict">;

		await expect(result).resolves.toBe("done-3");
		expect(observer).toHaveBeenCalledTimes(4);
		expect(observer).toHaveBeenNthCalledWith(3, 2);
	});

	it("unwraps a loopAccumulatorFrom value before running", async() => {
		interface Accumulator {
			total: number;
		}

		const initialAccumulator: Accumulator = { total: 0 };
		const from = DCommon.loopAccumulatorFrom(initialAccumulator);
		const result = DCommon.asyncLoopAccumulator(from, async({ accumulator, count, next, exit }) => count === 2
			? exit(accumulator.total)
			: next({ total: accumulator.total + 1 }));

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<number>, "strict">;

		expect(DCommon.loopAccumulatorKind.getValue(from)).toBe(initialAccumulator);
		await expect(result).resolves.toBe(2);
	});
});
