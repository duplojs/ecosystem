import { DArray, pipe, type ExpectType } from "@scripts";

describe("spliceInsert", () => {
	it("should insert values without mutating the source", () => {
		const source = [1, 4] as number[] & DArray.MinElements<2>;
		const result = DArray.spliceInsert(source, 1, [2, 3] as const);

		expect(result).toEqual([1, 2, 3, 4]);
		expect(source).toEqual([1, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should insert values in pipe", () => {
		const result = pipe(
			[1, 4] as const,
			DArray.spliceInsert(1, [2, 3] as const),
		);

		expect(result).toEqual([1, 2, 3, 4]);
	});

	it("should distribute constrained array unions before inserting values", () => {
		const source = [1, 4] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<2>);
		const result = DArray.spliceInsert(source, 1, [2, 3] as const);

		expect(result).toEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.MinElements<0>)
			| (readonly number[] & DArray.MinElements<2>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = [1, 4] as number[] & DArray.MaxElements<2>;
		const resultMax = DArray.spliceInsert(sourceMax, 1, [2, 3] as const);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			readonly number[],
			"strict"
		>;

		const sourceLength = [1, 4] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.spliceInsert(sourceLength, 1, [2, 3] as const);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly number[] & DArray.MinElements<2>,
			"strict"
		>;
	});
});
