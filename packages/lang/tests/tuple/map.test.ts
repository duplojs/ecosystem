import { DTuple, pipe, type ExpectType } from "@scripts";

describe("map", () => {
	it("should map tuple values with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DTuple.map(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				expect(params.self[params.index]).toBe(element);

				return `${params.index}:${element.length}` as const;
			},
		);

		expect(result).toEqual(["0:1", "1:2", "2:3"]);

		type _CheckResult = ExpectType<
			typeof result,
			[
				`${number}:${number}`,
				`${number}:${number}`,
				`${number}:${number}`,
			],
			"strict"
		>;
	});

	it("should map tuple values in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DTuple.map((value) => `${value}`),
		);

		expect(result).toEqual(["1", "2", "3"]);

		type _CheckResult = ExpectType<
			typeof result,
			[string, string, string],
			"strict"
		>;
	});

	it("should map non-empty arrays to wide arrays", () => {
		const source = ["a", "bb"] as [string, ...string[]];
		const result = DTuple.map(source, (value) => value.length);

		expect(result).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			[number, ...number[]],
			"strict"
		>;
	});
});
