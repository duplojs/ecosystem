import { DArray, pipe, type ExpectType } from "@scripts";

describe("some", () => {
	it("should validate at least one value with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.some(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("should validate at least one value in pipe", () => {
		const result = pipe(
			[1, 3, 4],
			DArray.some((value) => value % 2 === 0),
		);

		expect(result).toBe(true);
	});

	it("should return false when no value matches", () => {
		expect(DArray.some([1, 3, 5], (value) => value % 2 === 0)).toBe(false);
	});
});
