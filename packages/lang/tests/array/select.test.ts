import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number[],
			"strict"
		>;
	});

	it("should select values in pipe", () => {
		const result = DCommon.pipe(
			["a", "bb"] as const,
			DArray.select((params) => params.select(params.element.length)),
		);

		expect(result).toEqual([1, 2]);
	});
});
