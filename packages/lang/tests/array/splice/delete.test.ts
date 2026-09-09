import { DArray, pipe, type ExpectType } from "@scripts";

describe("spliceDelete", () => {
	it("should delete values without mutating the source", () => {
		const source = [1, 2, 3, 4] as number[] & DArray.MaxElements<4>;
		const result = DArray.spliceDelete(source, 1, 2);

		expect(result).toEqual([1, 4]);
		expect(source).toEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.MaxElements<4>,
			"strict"
		>;
	});

	it("should delete values in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.spliceDelete(1, 1),
		);

		expect(result).toEqual([1, 3]);
	});

	it("should distribute constrained array unions before deleting values", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.spliceDelete(source, 1, 1);

		expect(result).toEqual([1, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.MaxElements<0>)
			| (readonly number[] & DArray.MaxElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMin = [1, 2, 3] as number[] & DArray.MinElements<3>;
		const resultMin = DArray.spliceDelete(sourceMin, 1, 1);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			readonly number[],
			"strict"
		>;

		const sourceLength = [1, 2, 3] as number[] & DArray.LengthEqual<3>;
		const resultLength = DArray.spliceDelete(sourceLength, 1, 1);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly number[] & DArray.MaxElements<3>,
			"strict"
		>;
	});
});
