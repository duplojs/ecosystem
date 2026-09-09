import { DArray, pipe, type ExpectType } from "@scripts";

describe("prepend", () => {
	it("should prepend arrays without mutating the source", () => {
		const source = [1, 2] as number[] & DArray.MinElements<2>;
		const result = DArray.prepend(source, ["a"] as const, [true] as const);

		expect(result).toEqual(["a", true, 1, 2]);
		expect(source).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly (number | "a" | true)[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should prepend arrays in pipe", () => {
		const result = pipe(
			[1, 2] as const,
			DArray.prepend(["a"] as const),
		);

		expect(result).toEqual(["a", 1, 2]);
	});

	it("should distribute constrained array unions before prepending", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.prepend(source, ["x"] as const);

		expect(result).toEqual(["x", 1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly (number | "x")[] & DArray.MinElements<0>)
			| (readonly (number | "x")[] & DArray.MinElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = [1, 2] as number[] & DArray.MaxElements<2>;
		const resultMax = DArray.prepend(sourceMax, ["a"] as const);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			readonly (number | "a")[],
			"strict"
		>;

		const sourceLength = [1, 2] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.prepend(sourceLength, ["a"] as const);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly (number | "a")[] & DArray.MinElements<2>,
			"strict"
		>;
	});
});
