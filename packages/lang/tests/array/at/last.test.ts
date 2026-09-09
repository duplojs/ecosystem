import { DArray, type ExpectType } from "@scripts";

describe("last", () => {
	it("should return the last value", () => {
		const result = DArray.last(["a", "b"]);

		expect(result).toBe("b");

		type _CheckResult = ExpectType<
			typeof result,
			string | undefined,
			"strict"
		>;
	});

	it("should return undefined for an empty constrained array", () => {
		const source = [] as unknown as unknown[] & DArray.LengthEqual<0>;
		const result = DArray.last(source);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return the element type for a non-empty constrained array", () => {
		const source = ["a"] as string[] & DArray.MinElements<1>;
		const result = DArray.last(source);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should return the element type for a positive exact length constraint", () => {
		const source = ["a"] as string[] & DArray.LengthEqual<1>;
		const result = DArray.last(source);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
