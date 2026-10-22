import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";

describe("chunk", () => {
	it("splits iterable values into chunks", () => {
		const result = DGenerator.chunk([1, 2, 3, 4, 5], 2);

		expect(DArray.from(result)).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
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
		const result = DCommon.pipe(
			new Set(["a", "b", "c", "d"]),
			DGenerator.chunk(2),
		);

		expect(DArray.from(result)).toStrictEqual([["a", "b"], ["c", "d"]]);

		type _CheckResult = DCommon.ExpectType<
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

		type _CheckResult = DCommon.ExpectType<
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

	it.each([
		{
			size: 0.5,
			expected: [[1], [2], [3], [4], [5]],
		},
		{
			size: 2.4,
			expected: [[1, 2], [3, 4], [5]],
		},
		{
			size: 2.5,
			expected: [[1, 2, 3], [4, 5]],
		},
	] as const)("rounds fractional size $size without applying a maximum length constraint", ({ size, expected }) => {
		const input = [1, 2, 3, 4, 5];
		const result = DGenerator.chunk(input, size);

		expect(DArray.from(result)).toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("rounds a fractional size in pipe without applying a maximum length constraint", () => {
		const result = DCommon.pipe(
			new Set([1, 2, 3, 4, 5]),
			DGenerator.chunk(1.6),
		);

		expect(DArray.from(result)).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a negative integer literal", () => {
		const input = [1, 2];
		const result = DGenerator.chunk(input, -1);

		expect(DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a negative integer literal in pipe", () => {
		const result = DCommon.pipe(
			new Set([1, 2]),
			DGenerator.chunk(-2),
		);

		expect(DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a non-literal size", () => {
		const input = [1, 2, 3];
		const result = DGenerator.chunk(input, 2 as number);

		expect(DArray.from(result)).toStrictEqual([[1, 2], [3]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it.each([0, 0.1, NaN])("returns no chunks when size %s does not round to a positive number", (size) => {
		const result = DGenerator.chunk([1, 2], size);

		expect(DArray.from(result)).toStrictEqual([]);
	});
});
