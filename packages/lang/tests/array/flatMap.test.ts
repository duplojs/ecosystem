import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly number[],
			"strict"
		>;
	});

	it("should map and flatten values in pipe", () => {
		const result = DCommon.pipe(
			["a", "b"] as const,
			DArray.flatMap((value) => [value, value] as const),
		);

		expect(result).toEqual(["a", "a", "b", "b"]);
	});

	it("should flatten only one level when the callback returns nested arrays", () => {
		const result = DArray.flatMap(
			[1, 2],
			(value) => [[value]],
		);

		expect(result).toStrictEqual([[1], [2]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly number[][],
			"strict"
		>;
	});

	it("should flatten only one level when the callback returns nested arrays in pipe", () => {
		const source = [1, 2];
		const result = DCommon.pipe(
			source,
			DArray.flatMap((value) => [[value]]),
		);

		expect(result).toStrictEqual([[1], [2]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly number[][],
			"strict"
		>;
	});
});
