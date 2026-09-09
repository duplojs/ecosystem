import { DArray, pipe, type ExpectType } from "@scripts";

describe("copyWithin", () => {
	it("should copy values within an array without mutating the source", () => {
		const source = [1, 2, 3, 4] as
			& number[]
			& DArray.LengthEqual<4>
			& DArray.MinElements<4>
			& DArray.MaxElements<4>;
		const result = DArray.copyWithin(source, 1, 2);

		expect(result).toEqual([1, 3, 4, 4]);
		expect(source).toEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly number[] & DArray.LengthEqual<4> & DArray.MinElements<4> & DArray.MaxElements<4>,
			"strict"
		>;
	});

	it("should copy values within an array in pipe", () => {
		const result = pipe(
			[1, 2, 3, 4] as const,
			DArray.copyWithin(0, 2, 3),
		);

		expect(result).toEqual([3, 2, 3, 4]);
	});

	it("should distribute constrained array unions before copying within", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.copyWithin(source, 1, 2);

		expect(result).toEqual([1, 3, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.LengthEqual<0>)
			| (readonly number[] & DArray.LengthEqual<3>),
			"strict"
		>;
	});
});
