import * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";

describe("flat", () => {
	it("flattens one level by default", () => {
		const result = DGenerator.flat([[1, 2], [3]]);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("flattens values up to the requested depth", () => {
		const result = DGenerator.flat([[[1], [2]], [[3]]], 2);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("keeps nested values when depth is reached", () => {
		const result = DGenerator.flat([[[1], [2]]], 1);

		expect(DArray.from(result)).toStrictEqual([[1], [2]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly [1] | readonly [2], void, unknown>,
			"strict"
		>;
	});

	it("does not flatten non iterable values", () => {
		const result = DGenerator.flat([[1], 2, false, null, undefined]);

		expect(DArray.from(result)).toStrictEqual([1, 2, false, null, undefined]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<1 | 2 | false | null | undefined, void, unknown>,
			"strict"
		>;
	});

	it("preserves unions from nested and plain iterable values", () => {
		const input = [[1] as const, "a"] as (readonly [1] | "a")[];
		const result = DGenerator.flat(input);

		expect(DArray.from(result)).toStrictEqual([1, "a"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<1 | "a", void, unknown>,
			"strict"
		>;
	});

	it("keeps nested values and their type with a depth of zero", () => {
		const result = DGenerator.flat([[42] as const], 0);

		expect(DArray.from(result)).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly [42], void, unknown>,
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
	] as const)("infers unknown values for a negative or fractional depth of $depth", ({ depth, expected }) => {
		const result = DGenerator.flat([[42] as const], depth);

		expect(DArray.from(result)).toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<unknown, void, unknown>,
			"strict"
		>;
	});

	it("infers unknown values for a non-literal depth", () => {
		const depth = 0 as number;
		const result = DGenerator.flat([[42] as const], depth);

		expect(DArray.from(result)).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<unknown, void, unknown>,
			"strict"
		>;
	});

	it("preserves possible values for a union of valid literal depths", () => {
		const depth = 0 as 0 | 1;
		const result = DGenerator.flat([[42] as const], depth);

		expect(DArray.from(result)).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<readonly [42] | 42, void, unknown>,
			"strict"
		>;
	});

	it("infers unknown values when a depth union includes an invalid literal", () => {
		const depth = 0 as 0 | -1;
		const result = DGenerator.flat([[42] as const], depth);

		expect(DArray.from(result)).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<unknown, void, unknown>,
			"strict"
		>;
	});

	it.each([undefined, 42] as const)("preserves objects with a non-callable iterator of %s", (iterator) => {
		const input = { [Symbol.iterator]: iterator };
		const result = DGenerator.flat([input]);
		const values = DArray.from(result);

		expect(values).toHaveLength(1);
		expect(DArray.first(values)).toBe(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<typeof input, void, unknown>,
			"strict"
		>;
	});

	it("uses sync iteration and preserves promises when both protocols are available", () => {
		const value = Promise.resolve("sync" as const);
		const input = {
			*[Symbol.iterator]() {
				yield value;
			},
			async *[Symbol.asyncIterator]() {
				yield await Promise.resolve(42 as const);
			},
		};
		const result = DGenerator.flat([input]);

		expect(DArray.from(result)).toStrictEqual([value]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<Promise<"sync">, void, unknown>,
			"strict"
		>;
	});
});
