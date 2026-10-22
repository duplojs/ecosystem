import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

describe("chunk", () => {
	it("should split an array into chunks", () => {
		const result = DArray.chunk([1, 2, 3, 4, 5] as const, 2);

		expect(result).toEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (
				& readonly (1 | 2 | 3 | 4 | 5)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>
			)[],
			"strict"
		>;
	});

	it("should split an array with non literal value", () => {
		const result = DArray.chunk([1, 2, 3, 4, 5] as const, 2 as number);

		expect(result).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (
				& readonly (1 | 2 | 3 | 4 | 5)[]
				& DArray.MinElements<1>
			)[],
			"strict"
		>;
	});

	it("should split an array into chunks in pipe", () => {
		const result = DCommon.pipe(
			[1, 2, 3] as const,
			DArray.chunk(2),
		);

		expect(result).toEqual([[1, 2], [3]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (
				& readonly (1 | 2 | 3)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>
			)[],
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
	] as const)("should round fractional size $size without applying a maximum length constraint", ({ size, expected }) => {
		const result = DArray.chunk([1, 2, 3, 4, 5], size);

		expect(result).toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly number[] & DArray.MinElements<1>)[],
			"strict"
		>;
	});

	it("should round a fractional size in pipe without applying a maximum length constraint", () => {
		const result = DCommon.pipe(
			[1, 2, 3, 4, 5],
			DArray.chunk(1.6),
		);

		expect(result).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly (1 | 2 | 3 | 4 | 5)[] & DArray.MinElements<1>)[],
			"strict"
		>;
	});

	it("should not apply a maximum length constraint for a negative integer literal", () => {
		const result = DArray.chunk([1, 2], -1);

		expect(result).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly number[] & DArray.MinElements<1>)[],
			"strict"
		>;
	});

	it("should not apply a maximum length constraint for a negative integer literal in pipe", () => {
		const result = DCommon.pipe(
			[1, 2],
			DArray.chunk(-2),
		);

		expect(result).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly (1 | 2)[] & DArray.MinElements<1>)[],
			"strict"
		>;
	});

	it.each([0, 0.1, -1, NaN])("should return no chunks when size %s does not round to a positive number", (size) => {
		const result = DArray.chunk([1, 2], size);

		expect(result).toStrictEqual([]);
	});

	it("should return no chunks for an empty array", () => {
		const result = DArray.chunk([], 2);

		expect(result).toStrictEqual([]);
	});
});
