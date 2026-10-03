import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

describe("concat", () => {
	it("should concat arrays without mutating the source", () => {
		const source = [1, 2] as number[] & DArray.MinElements<2>;
		const result = DArray.concat(source, ["a"] as const, [true] as const);

		expect(result).toEqual([1, 2, "a", true]);
		expect(source).toEqual([1, 2]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (number | "a" | true)[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should concat arrays in pipe", () => {
		const result = DCommon.pipe(
			[1, 2] as const,
			DArray.concat(["a"] as const),
		);

		expect(result).toEqual([1, 2, "a"]);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly (1 | 2 | "a")[] & DArray.MinElements<2>, "strict">;
	});

	it("should distribute constrained array unions before concatenating", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.concat(source, ["x"] as const);

		expect(result).toEqual([1, 2, 3, "x"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| (readonly (number | "x")[] & DArray.MinElements<0>)
			| (readonly (number | "x")[] & DArray.MinElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = [1, 2] as number[] & DArray.MaxElements<2>;
		const resultMax = DArray.concat(sourceMax, ["a"] as const);

		type _CheckMaxResult = DCommon.ExpectType<
			typeof resultMax,
			readonly (number | "a")[],
			"strict"
		>;

		const sourceLength = [1, 2] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.concat(sourceLength, ["a"] as const);

		type _CheckLengthResult = DCommon.ExpectType<
			typeof resultLength,
			readonly (number | "a")[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("accepts several readonly arrays without mutating them", () => {
		const source = Object.freeze([1, 2] as const);
		const elements = Object.freeze(["a"] as const);
		const rest = Object.freeze([true] as const);
		const result = DArray.concat(source, elements, rest, rest);

		expect(result).toStrictEqual([1, 2, "a", true, true]);
		expect(source).toStrictEqual([1, 2]);
		expect(elements).toStrictEqual(["a"]);
		expect(rest).toStrictEqual([true]);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly (1 | 2 | "a" | true)[] & DArray.MinElements<2>, "strict">;
	});

	it("returns a new array when all concatenated arrays are empty", () => {
		const source = [] as const;
		const result = DArray.concat(source, [] as const, [] as const);

		expect(result).toStrictEqual([]);
		expect(result).not.toBe(source);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly never[], "strict">;
	});
});
