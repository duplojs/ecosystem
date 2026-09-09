import { DArray, pipe, type ExpectType } from "@scripts";

describe("fillAll", () => {
	it("should fill the whole array without mutating the source", () => {
		const source = [1, 2, 3] as
			& number[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = DArray.fillAll(source, "x");

		expect(result).toEqual(["x", "x", "x"]);
		expect(source).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly string[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should fill the whole array in pipe", () => {
		const result = pipe(
			[1, 2] as const,
			DArray.fillAll("x"),
		);

		expect(result).toEqual(["x", "x"]);
	});

	it("should distribute constrained array unions before filling the whole array", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.fillAll(source, "x");

		expect(result).toEqual(["x", "x", "x"]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly string[] & DArray.LengthEqual<0>)
			| (readonly string[] & DArray.LengthEqual<3>),
			"strict"
		>;
	});
});
