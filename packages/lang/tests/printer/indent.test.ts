import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("indent", () => {
	it("returns repeated tabs for a finite positive level", () => {
		const result = DPrinter.indent(2);

		type _CheckResult = DCommon.ExpectType<
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
