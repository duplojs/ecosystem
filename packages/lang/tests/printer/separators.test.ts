import { DPrinter, type ExpectType } from "@scripts";

describe("separators", () => {
	it("exposes printable separators", () => {
		type _CheckTab = ExpectType<
			typeof DPrinter.tab,
			"\t",
			"strict"
		>;
		type _CheckBack = ExpectType<
			typeof DPrinter.back,
			"\n",
			"strict"
		>;
		type _CheckDash = ExpectType<
			typeof DPrinter.dash,
			"-",
			"strict"
		>;

		expect(DPrinter.tab).toBe("\t");
		expect(DPrinter.back).toBe("\n");
		expect(DPrinter.dash).toBe("-");
	});
});
