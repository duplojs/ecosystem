import { DArray, type DNumber, type ExpectType } from "@scripts";

describe("length", () => {
	it("should return the length of a wide array", () => {
		const result = DArray.length(["a", "b"]);

		expect(result).toBe(2);

		type _CheckResult = ExpectType<
			typeof result,
			number & DNumber.Positive,
			"strict"
		>;
	});

	it("should preserve tuple length", () => {
		const result = DArray.length(["a", "b"] as const);

		type _CheckResult = ExpectType<
			typeof result,
			2 & DNumber.StrictPositive,
			"strict"
		>;
	});

	it("should preserve empty tuple length", () => {
		const result = DArray.length([] as const);

		type _CheckResult = ExpectType<
			typeof result,
			0 & DNumber.Positive,
			"strict"
		>;
	});

	it("should distribute tuple unions before returning the length", () => {
		const source = [1] as readonly [] | readonly [1];
		const result = DArray.length(source);

		expect(result).toBe(1);

		type _CheckResult = ExpectType<
			typeof result,
			| (0 & DNumber.Positive)
			| (1 & DNumber.StrictPositive),
			"strict"
		>;
	});
});
