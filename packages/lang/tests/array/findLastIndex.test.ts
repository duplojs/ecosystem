import { DArray, pipe, type ExpectType } from "@scripts";

describe("findLastIndex", () => {
	it("should find the last matching index with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.findLastIndex(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toBe(2);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should find the last matching index in pipe", () => {
		const result = pipe(
			[1, 2, 3, 4] as const,
			DArray.findLastIndex((value) => value > 2),
		);

		expect(result).toBe(3);
	});

	it("should return undefined when no value matches", () => {
		expect(DArray.findLastIndex([1, 2], (value) => value > 3)).toBeUndefined();
	});
});
