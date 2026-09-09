import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("concat", () => {
	it("concatenates several iterables", () => {
		const result = DGenerator.concat([1, 2] as const, new Set([3] as const), [4, 5] as const);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3, 4, 5]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | 2 | 3 | 4 | 5, unknown, unknown>,
			"strict"
		>;
	});

	it("concatenates values in pipe", () => {
		const tail: Iterable<string> = new Set(["c", "d"]);
		const result = pipe(
			["a", "b"],
			DGenerator.concat(tail),
		);

		expect(DArray.from(result)).toStrictEqual(["a", "b", "c", "d"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<string, unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions across concatenated iterables", () => {
		const head = [1] as (1 | "a")[];
		const tail = ["a"] as (1 | "a")[];
		const result = DGenerator.concat(head, tail);

		expect(DArray.from(result)).toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
