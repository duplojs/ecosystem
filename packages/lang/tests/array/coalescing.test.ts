import { DArray, type ExpectType } from "@scripts";

describe("coalescing", () => {
	it("should keep arrays unchanged", () => {
		const source = ["a", "b"] as const;
		const result = DArray.coalescing(source);

		expect(result).toBe(source);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["a", "b"],
			"strict"
		>;
	});

	it("should wrap a value in an array", () => {
		const result = DArray.coalescing("a");

		expect(result).toEqual(["a"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["a"],
			"strict"
		>;
	});
});
