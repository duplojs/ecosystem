import { DArray, type ExpectType } from "@scripts";

describe("first", () => {
	it("should return the first value", () => {
		const result = DArray.first(["a", "b"]);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			string | undefined,
			"strict"
		>;
	});

	it("should distribute array unions before returning the first value", () => {
		const source = ["a", "b"] as readonly ["a", "b"] | readonly [];
		const result = DArray.first(source);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return undefined for an empty array", () => {
		const source = [] as unknown[];

		expect(DArray.first(source)).toBeUndefined();
	});

	it("should return the element type for a non-empty constrained array", () => {
		const source = ["a"] as string[] & DArray.MinElements<1>;
		const result = DArray.first(source);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should return undefined for an empty constrained array", () => {
		const source = [] as unknown as unknown[] & DArray.LengthEqual<0>;
		const result = DArray.first(source);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return the element type for a positive exact length constraint", () => {
		const source = ["a"] as string[] & DArray.LengthEqual<1>;
		const result = DArray.first(source);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
