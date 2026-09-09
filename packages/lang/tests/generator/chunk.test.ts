import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("chunk", () => {
	it("splits iterable values into chunks", () => {
		const result = DGenerator.chunk([1, 2, 3, 4, 5], 2);

		expect(DArray.from(result)).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<
				& readonly (1 | 2 | 3 | 4 | 5)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});

	it("splits values in pipe", () => {
		const result = pipe(
			new Set(["a", "b", "c", "d"]),
			DGenerator.chunk(2),
		);

		expect(DArray.from(result)).toStrictEqual([["a", "b"], ["c", "d"]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<
				& readonly string[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});

	it("returns no chunks for an empty iterable", () => {
		const result = DGenerator.chunk([] as number[], 3);

		expect(DArray.from(result)).toStrictEqual([]);
	});

	it("preserves item unions inside generated chunks", () => {
		const input = [1, "a"] as (1 | "a")[];
		const result = DGenerator.chunk(input, 2);

		expect(DArray.from(result)).toStrictEqual([[1, "a"]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<
				& readonly ("a" | 1)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});
});
