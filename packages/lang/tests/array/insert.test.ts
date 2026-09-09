import { DArray, pipe, type ExpectType } from "@scripts";

describe("insert", () => {
	it("should insert a value without mutating the source", () => {
		const source = [1, 2] as number[] & DArray.MinElements<2>;
		const result = DArray.insert("a" as string, source);

		expect(result).toEqual([1, 2, "a"]);
		expect(source).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly (number | string)[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should insert a value in pipe", () => {
		const result = pipe(
			"a",
			DArray.insert([1, 2] as const),
		);

		expect(result).toEqual([1, 2, "a"]);
	});

	it("should distribute constrained array unions before inserting", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.insert("x", source);

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
		const resultMax = DArray.insert("a", sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			readonly (number | "a")[],
			"strict"
		>;

		const sourceLength = [1, 2] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.insert("a", sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly (number | "a")[] & DArray.MinElements<2>,
			"strict"
		>;
	});
});
