import { type ExpectType, DChrono } from "@scripts";

describe("toTimeValue", () => {
	it("parses positive time strings", () => {
		const result = DChrono.toTimeValue("time123+");

		expect(result).toBe(123);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("parses negative time strings", () => {
		expect(DChrono.toTimeValue("time123-")).toBe(-123);
	});

	it("clamps values above maxTimeValue", () => {
		const input = "time9999999999999999+";
		const result = DChrono.toTimeValue(input);

		expect(result).toBe(DChrono.maxTimeValue);
	});

	it("clamps values below minTimeValue", () => {
		const input = "time9999999999999999-";
		const result = DChrono.toTimeValue(input);

		expect(result).toBe(DChrono.minTimeValue);
	});
});
