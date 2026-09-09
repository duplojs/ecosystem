import { DArray, type ExpectType } from "@scripts";

describe("flat", () => {
	it("should flatten an array with default depth", () => {
		const result = DArray.flat([1, [2, 3]] as const);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | 2 | 3)[],
			"strict"
		>;
	});

	it("should flatten an array with custom depth", () => {
		const result = DArray.flat([1, [2, [3]]] as const, 2);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | 2 | 3)[],
			"strict"
		>;
	});
});
