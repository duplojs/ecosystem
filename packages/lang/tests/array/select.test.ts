import { DArray, pipe, type ExpectType } from "@scripts";

describe("select", () => {
	it("should select mapped values and skip others", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.select(
			source,
			(params) => {
				expect(params.self).toBe(source);

				return params.index % 2 === 0
					? params.select(params.element.length)
					: params.skip();
			},
		);

		expect(result).toEqual([1, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			number[],
			"strict"
		>;
	});

	it("should select values in pipe", () => {
		const result = pipe(
			["a", "bb"] as const,
			DArray.select((params) => params.select(params.element.length)),
		);

		expect(result).toEqual([1, 2]);
	});
});
