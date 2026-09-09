import { DArray, pipe, type ExpectType } from "@scripts";

describe("flatMap", () => {
	it("should map and flatten values with callback params", () => {
		const source = ["a", "bb"] as const;
		const result = DArray.flatMap(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return [params.index, element.length] as const;
			},
		);

		expect(result).toEqual([0, 1, 1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			number[],
			"strict"
		>;
	});

	it("should map and flatten values in pipe", () => {
		const result = pipe(
			["a", "b"] as const,
			DArray.flatMap((value) => [value, value] as const),
		);

		expect(result).toEqual(["a", "a", "b", "b"]);
	});
});
