import * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";

describe("flat", () => {
	it("should flatten an array with default depth", () => {
		const result = DArray.flat([1, [2, 3]] as const);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (1 | 2 | 3)[],
			"strict"
		>;
	});

	it("should flatten an array with custom depth", () => {
		const result = DArray.flat([1, [2, [3]]] as const, 2);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (1 | 2 | 3)[],
			"strict"
		>;
	});

	it("keeps nested arrays and their type with a depth of zero", () => {
		const result = DArray.flat([[42]] as const, 0);

		expect(result).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly [42])[],
			"strict"
		>;
	});

	it.each([
		{
			depth: -1,
			expected: [[42]],
		},
		{
			depth: 0.5,
			expected: [[42]],
		},
		{
			depth: 1.5,
			expected: [42],
		},
	] as const)("infers unknown elements for a negative or fractional depth of $depth", ({ depth, expected }) => {
		const result = DArray.flat([[42]] as const, depth);

		expect(result).toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly unknown[],
			"strict"
		>;
	});

	it("infers unknown elements for a non-literal depth", () => {
		const depth = 0 as number;
		const result = DArray.flat([[42]] as const, depth);

		expect(result).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly unknown[],
			"strict"
		>;
	});

	it("preserves possible elements for a union of valid literal depths", () => {
		const depth = 0 as 0 | 1;
		const result = DArray.flat([[42]] as const, depth);

		expect(result).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly [42] | 42)[],
			"strict"
		>;
	});

	it("infers unknown elements when a depth union includes an invalid literal", () => {
		const depth = 0 as 0 | -1;
		const result = DArray.flat([[42]] as const, depth);

		expect(result).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly unknown[],
			"strict"
		>;
	});

	it("preserves promises and non-array iterables", () => {
		const value = Promise.resolve(42 as const);
		const iterable = new Set([1]);
		const result = DArray.flat([iterable, [value], "text"] as const);

		expect(result).toStrictEqual([iterable, value, "text"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (Set<number> | Promise<42> | "text")[],
			"strict"
		>;
	});
});
