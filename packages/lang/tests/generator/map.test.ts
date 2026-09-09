import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("map", () => {
	it("maps iterable values with callback params", () => {
		const input = new Set(["a", "bb"] as const);
		const result = DGenerator.map(
			input,
			(item, params) => {
				expect(params.self).toBe(input);
				return String(`${params.index}:${item.length}`);
			},
		);

		expect(DArray.from(result)).toStrictEqual(["0:1", "1:2"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<string, unknown, unknown>,
			"strict"
		>;
	});

	it("maps values in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DGenerator.map((item) => item * 2),
		);

		expect(DArray.from(result)).toStrictEqual([2, 4, 6]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions from iterable input", () => {
		const input = [1, "a"] as (1 | "a")[];
		const result = DGenerator.map(input, (item) => {
			type _CheckItem = ExpectType<
				typeof item,
				1 | "a",
				"strict"
			>;

			return item;
		});

		expect(DArray.from(result)).toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
