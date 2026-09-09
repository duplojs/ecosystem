import { type DArray, DNumber, pipe, type ExpectType } from "@scripts";

describe("sort", () => {
	it("should sort numbers in ascending order", () => {
		const source = [3, 1, 2] as number[] & DArray.LengthEqual<3>;
		const result = DNumber.sort(source, "ASC");

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.LengthEqual<3>,
			"strict"
		>;
	});

	it("should sort numbers in descending order with curry", () => {
		const result = DNumber.sort("DSC")([3, 1, 2]);

		expect(result).toEqual([3, 2, 1]);
	});

	it("should distribute constrained array unions before sorting numbers", () => {
		const source = [3, 1, 2] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DNumber.sort(source, "ASC");

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.LengthEqual<0>)
			| (readonly number[] & DArray.LengthEqual<3>),
			"strict"
		>;
	});

	it("should sort numbers inside a pipe without mutating the source", () => {
		const source = [3, 1, 2];
		const result = pipe(
			source,
			DNumber.sort("ASC"),
			(array) => array.slice(0, 2),
		);

		expect(result).toEqual([1, 2]);
		expect(source).toEqual([3, 1, 2]);
	});
});
