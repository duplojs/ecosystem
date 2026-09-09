import { DString, type DNumber, type ExpectType } from "@scripts";

describe("length", () => {
	it("should return string length", () => {
		const result = DString.length("hello");

		expect(result).toBe(5);

		type _CheckResult = ExpectType<
			typeof result,
			number & DNumber.Positive,
			"strict"
		>;
	});

	it("should return zero for an empty string", () => {
		expect(DString.length("")).toBe(0);
	});
});
