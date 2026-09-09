import { DString, type ExpectType } from "@scripts";

describe("isNumber", () => {
	it("should validate number strings", () => {
		expect(DString.isNumber("0")).toBe(true);
		expect(DString.isNumber("-12")).toBe(true);
		expect(DString.isNumber("12.5")).toBe(true);
		expect(DString.isNumber(".5")).toBe(true);
		expect(DString.isNumber("1e3")).toBe(true);
		expect(DString.isNumber("-2.5E-4")).toBe(true);
	});

	it("should reject invalid number strings", () => {
		expect(DString.isNumber("")).toBe(false);
		expect(DString.isNumber(" ")).toBe(false);
		expect(DString.isNumber("+1")).toBe(false);
		expect(DString.isNumber("1.")).toBe(false);
		expect(DString.isNumber("1a")).toBe(false);
		expect(DString.isNumber("NaN")).toBe(false);
		expect(DString.isNumber("Infinity")).toBe(false);
	});

	it("should narrow the string with a number constraint", () => {
		const source = "12.5" as string;

		if (DString.isNumber(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.Number,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});

	it("should preserve a number literal type", () => {
		const source = "12.5" as const;

		if (DString.isNumber(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				"12.5",
				"strict"
			>;
		}
	});
});
