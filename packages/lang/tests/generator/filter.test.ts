import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("filter", () => {
	it("filters iterable values with callback params", () => {
		const input = new Set([3, 4, 5]);
		const result = DGenerator.filter(
			input,
			(item, params) => {
				expect(params.self).toBe(input);
				return item + params.index > 4;
			},
		);

		expect(DArray.from(result)).toStrictEqual([4, 5]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("narrows values with a type predicate in pipe", () => {
		const result = pipe(
			[1, "a", 2, "b"] as const,
			DGenerator.filter((item): item is 1 | 2 => typeof item === "number"),
		);

		expect(DArray.from(result)).toStrictEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | 2, unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions when filtering iterable input with a boolean predicate", () => {
		const input = [1, "a"] as (1 | "a")[];
		const result = DGenerator.filter(input, (item) => {
			type _CheckItem = ExpectType<
				typeof item,
				1 | "a",
				"strict"
			>;

			return true;
		});

		expect(DArray.from(result)).toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
