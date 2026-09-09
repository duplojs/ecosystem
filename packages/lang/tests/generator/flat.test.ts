import { DArray, DGenerator, type ExpectType } from "@scripts";

describe("flat", () => {
	it("flattens one level by default", () => {
		const result = DGenerator.flat([[1, 2], [3]]);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("flattens values up to the requested depth", () => {
		const result = DGenerator.flat([[[1], [2]], [[3]]], 2);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("keeps nested values when depth is reached", () => {
		const result = DGenerator.flat([[[1], [2]]], 1);

		expect(DArray.from(result)).toStrictEqual([[1], [2]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<readonly [1] | readonly [2], void, unknown>,
			"strict"
		>;
	});

	it("does not flatten non iterable values", () => {
		const result = DGenerator.flat([[1], 2, false, null, undefined]);

		expect(DArray.from(result)).toStrictEqual([1, 2, false, null, undefined]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | 2 | false | null | undefined, void, unknown>,
			"strict"
		>;
	});

	it("preserves unions from nested and plain iterable values", () => {
		const input = [[1] as const, "a"] as (readonly [1] | "a")[];
		const result = DGenerator.flat(input);

		expect(DArray.from(result)).toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | "a", void, unknown>,
			"strict"
		>;
	});
});
