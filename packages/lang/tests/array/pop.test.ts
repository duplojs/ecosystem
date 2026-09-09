import { DArray, type ExpectType } from "@scripts";

describe("pop", () => {
	it("should remove the last value without mutating the source", () => {
		const source = [1, 2, 3] as number[] & DArray.MaxElements<3>;
		const result = DArray.pop(source);

		expect(result).toEqual([1, 2]);
		expect(source).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should keep an empty array empty", () => {
		expect(DArray.pop([])).toEqual([]);
	});

	it("should distribute constrained array unions before removing the last value", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.pop(source);

		expect(result).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.MaxElements<0>)
			| (readonly number[] & DArray.MaxElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMin = [1, 2, 3] as number[] & DArray.MinElements<3>;
		const resultMin = DArray.pop(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			readonly number[],
			"strict"
		>;

		const sourceLength = [1, 2, 3] as number[] & DArray.LengthEqual<3>;
		const resultLength = DArray.pop(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly number[] & DArray.MaxElements<3>,
			"strict"
		>;
	});
});
