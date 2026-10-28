import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

describe("every", () => {
	it("should validate every value with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.every(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toBe(true);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("should validate every value in pipe", () => {
		const result = DCommon.pipe(
			[2, 4, 6],
			DArray.every((value) => value % 2 === 0),
		);

		expect(result).toBe(true);
	});

	it("should stop on the first invalid value", () => {
		expect(DArray.every([2, 3, 4], (value) => value % 2 === 0)).toBe(false);
	});
});
