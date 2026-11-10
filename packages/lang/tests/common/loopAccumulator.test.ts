import * as DCommon from "@scripts/common";

describe("loopAccumulator", () => {
	it("updates the accumulator and returns the exit value", () => {
		const observer = vi.fn();
		const result = DCommon.loopAccumulator(0, ({ accumulator, count, next, exit }) => {
			observer(accumulator);

			return count === 3
				? exit(`done-${accumulator}`)
				: next(accumulator + 1);
		});

		type _CheckResult = DCommon.ExpectType<typeof result, `done-${number}`, "strict">;

		expect(result).toBe("done-3");
		expect(observer).toHaveBeenCalledTimes(4);
		expect(observer).toHaveBeenNthCalledWith(3, 2);
	});

	it("unwraps a loopAccumulatorFrom value before running", () => {
		interface Accumulator {
			total: number;
		}

		const initialAccumulator: Accumulator = { total: 0 };
		const from = DCommon.loopAccumulatorFrom(initialAccumulator);
		const result = DCommon.loopAccumulator(from, ({ accumulator, count, next, exit }) => count === 2
			? exit(accumulator.total)
			: next({ total: accumulator.total + 1 }));

		type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

		expect(DCommon.loopAccumulatorKind.getValue(from)).toBe(initialAccumulator);
		expect(result).toBe(2);
	});
});
