import { DArray, pipe, type ExpectType } from "@scripts";

describe("push", () => {
	it("should push values without mutating the source", () => {
		const source = [1, 2] as number[] & DArray.MinElements<2>;
		const result = DArray.push(source, "a", true);

		expect(result).toEqual([1, 2, "a", true]);
		expect(source).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly (number | "a" | boolean)[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should push a value in pipe", () => {
		const result = pipe(
			[1, 2] as const,
			DArray.push("a"),
		);

		expect(result).toEqual([1, 2, "a"]);
	});

	it("should distribute constrained array unions before pushing", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.push(source, "x");

		expect(result).toEqual([1, 2, 3, "x"]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly (number | "x")[] & DArray.MinElements<0>)
			| (readonly (number | "x")[] & DArray.MinElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = [1, 2] as number[] & DArray.MaxElements<2>;
		const resultMax = DArray.push(sourceMax, "a" as string);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			readonly (number | string)[],
			"strict"
		>;

		const sourceLength = [1, 2] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.push(sourceLength, "a" as string);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly (number | string)[] & DArray.MinElements<2>,
			"strict"
		>;
	});
});
