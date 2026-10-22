import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

describe("at", () => {
	it("should return a maybe element for tuple input", () => {
		const result = DArray.at(["a", "b", "c"] as const, 1);

		expect(result).toBe("b");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"a" | "b" | "c",
			"strict"
		>;
	});

	it("should distribute array unions before returning the value at an index", () => {
		const source = ["a", "b"] as readonly ["a", "b"] | readonly [];
		const result = DArray.at(source, 0);

		expect(result).toBe("a");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return a maybe element for tuple input with out of range index", () => {
		const result = DArray.at(["a" as const, "b" as const], 4);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should infer undefined for a negative index before the start of a tuple", () => {
		const result = DArray.at(["a"] as const, -2);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return a maybe value for a wide array", () => {
		const result = DArray.at(["a", "b"], 4);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string | undefined,
			"strict"
		>;
	});

	it.each([
		{
			index: -1,
			expected: "b",
		},
		{
			index: -2,
			expected: "a",
		},
	] as const)("should return $expected at negative index $index", ({ index, expected }) => {
		const result = DArray.at(["a", "b"] as const, index);

		expect(result).toBe(expected);

		type _CheckResult = DCommon.ExpectType<typeof result, "a" | "b", "strict">;
	});

	it("should return an element at a negative index in pipe", () => {
		const result = DCommon.pipe(["a"] as const, DArray.at(-1));

		expect(result).toBe("a");

		type _CheckResult = DCommon.ExpectType<typeof result, "a", "strict">;
	});

	it("should return undefined for a negative index on an empty tuple", () => {
		const result = DArray.at([] as const, -1);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<typeof result, undefined, "strict">;
	});

	it("should preserve undefined for a union of valid and out of range indices", () => {
		const result = DArray.at(["a"] as const, -2 as -1 | -2);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<typeof result, "a" | undefined, "strict">;
	});

	it("should use minimum length constraints for negative indices", () => {
		const source = ["a", "b"] as string[] & DArray.MinElements<2>;
		const coveredResult = DArray.at(source, -2);
		const maybeResult = DArray.at(source, -3);

		expect(coveredResult).toBe("a");
		expect(maybeResult).toBeUndefined();

		type _CheckCoveredResult = DCommon.ExpectType<typeof coveredResult, string, "strict">;
		type _CheckMaybeResult = DCommon.ExpectType<typeof maybeResult, string | undefined, "strict">;
	});

	it("should use maximum length constraints for negative indices", () => {
		const source = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const maybeResult = DArray.at(source, -2);
		const outOfRangeResult = DArray.at(source, -3);

		expect(maybeResult).toBe("a");
		expect(outOfRangeResult).toBeUndefined();

		type _CheckMaybeResult = DCommon.ExpectType<typeof maybeResult, string | undefined, "strict">;
		type _CheckOutOfRangeResult = DCommon.ExpectType<typeof outOfRangeResult, undefined, "strict">;
	});

	it("should use exact length constraints for negative indices", () => {
		const source = ["a", "b"] as string[] & DArray.LengthEqual<2>;
		const coveredResult = DArray.at(source, -2);
		const outOfRangeResult = DArray.at(source, -3);

		expect(coveredResult).toBe("a");
		expect(outOfRangeResult).toBeUndefined();

		type _CheckCoveredResult = DCommon.ExpectType<typeof coveredResult, string, "strict">;
		type _CheckOutOfRangeResult = DCommon.ExpectType<typeof outOfRangeResult, undefined, "strict">;
	});

	it("should keep fractional indices optional regardless of their sign or integer part", () => {
		const negativeResult = DArray.at(["a"] as const, -1.5);
		const coveredResult = DArray.at(["a"] as const, 0.5);
		const outOfRangeResult = DArray.at(["a"] as const, 1.5);

		expect(negativeResult).toBe("a");
		expect(coveredResult).toBe("a");
		expect(outOfRangeResult).toBeUndefined();

		type _CheckNegativeResult = DCommon.ExpectType<typeof negativeResult, "a" | undefined, "strict">;
		type _CheckCoveredResult = DCommon.ExpectType<typeof coveredResult, "a" | undefined, "strict">;
		type _CheckOutOfRangeResult = DCommon.ExpectType<typeof outOfRangeResult, "a" | undefined, "strict">;
	});

	it("should return the element type when the index is covered by constraints", () => {
		const source = ["a", "b"] as string[] & DArray.MinElements<2>;
		const result = DArray.at(source, 1);

		expect(result).toBe("b");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should return undefined when the index is out of range by constraints", () => {
		const source = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const result = DArray.at(source, 4);

		expect(result).toBeUndefined();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should use exact length constraints to decide if an index exists", () => {
		const source = ["a", "b"] as string[] & DArray.LengthEqual<2>;
		const coveredResult = DArray.at(source, 1);
		expect(coveredResult).toBe("b");

		type _CheckCoveredResult = DCommon.ExpectType<
			typeof coveredResult,
			string,
			"strict"
		>;

		const outOfRangeResult = DArray.at(source, 2);
		expect(outOfRangeResult).toBeUndefined();

		type _CheckOutOfRangeResult = DCommon.ExpectType<
			typeof outOfRangeResult,
			undefined,
			"strict"
		>;
	});
});
