import { DArray, pipe, type ExpectType } from "@scripts";

describe("spliceReplace", () => {
	it("should replace values without mutating the source", () => {
		const source = [1, 2, 3, 4] as const;
		const result = DArray.spliceReplace(source, 1, ["a", "b"] as const);

		expect(result).toEqual([1, "a", "b", 4]);
		expect(source).toEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | 2 | 3 | 4 | "a" | "b")[],
			"strict"
		>;
	});

	it("should replace values in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.spliceReplace(1, ["a"] as const),
		);

		expect(result).toEqual([1, "a", 3]);
	});
});
