import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("separators", () => {
	it("exposes printable separators", () => {
		type _CheckTab = DCommon.ExpectType<
			typeof DPrinter.tab,
			"\t",
			"strict"
		>;
		type _CheckBack = DCommon.ExpectType<
			typeof DPrinter.back,
			"\n",
			"strict"
		>;
		type _CheckDash = DCommon.ExpectType<
			typeof DPrinter.dash,
			"-",
			"strict"
		>;

		expect(DPrinter.tab).toBe("\t");
		expect(DPrinter.back).toBe("\n");
		expect(DPrinter.dash).toBe("-");
	});
});
