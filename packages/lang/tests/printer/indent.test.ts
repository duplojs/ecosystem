import { DPrinter, type ExpectType } from "@scripts";

describe("indent", () => {
	it("returns repeated tabs for a finite positive level", () => {
		const result = DPrinter.indent(2);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("\t\t");
	});

	it("returns an empty string for invalid levels", () => {
		expect(DPrinter.indent(-1)).toBe("");
		expect(DPrinter.indent(Number.POSITIVE_INFINITY)).toBe("");
	});
});
