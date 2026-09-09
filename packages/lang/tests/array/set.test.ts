import { DArray, pipe, type ExpectType } from "@scripts";

describe("set", () => {
	it("should set a value without mutating the source", () => {
		const source = [1, 2, 3] as const;
		const result = DArray.set(source, 1, "a");

		expect(result).toEqual([1, "a", 3]);
		expect(source).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | 2 | 3 | "a")[],
			"strict"
		>;
	});

	it("should set a value in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.set(1, "a"),
		);

		expect(result).toEqual([1, "a", 3]);
	});

	it("should wrap negative indexes", () => {
		expect(DArray.set([1, 2, 3], -1, 4)).toEqual([1, 2, 4]);
	});

	it("should wrap indexes greater than the array length", () => {
		expect(DArray.set([1, 2, 3], 4, 5)).toEqual([1, 5, 3]);
	});
});
