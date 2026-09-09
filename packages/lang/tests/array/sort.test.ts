import { DArray, pipe, type ExpectType } from "@scripts";

describe("sort", () => {
	it("should sort values without mutating the source", () => {
		const source = [3, 1, 2] as
			& number[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = DArray.sort(source, (first, second) => first - second);

		expect(result).toEqual([1, 2, 3]);
		expect(source).toEqual([3, 1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should sort values in pipe", () => {
		const result = pipe(
			[3, 1, 2] as const,
			DArray.sort((first, second) => first - second),
		);

		expect(result).toEqual([1, 2, 3]);
	});

	it("should distribute constrained array unions before sorting", () => {
		const source = [3, 1, 2] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.sort(source, (first, second) => first - second);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.LengthEqual<0>)
			| (readonly number[] & DArray.LengthEqual<3>),
			"strict"
		>;
	});
});
