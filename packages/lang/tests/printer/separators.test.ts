import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("separators", () => {
	it("exposes printable separators", () => {
		type _CheckDash = DCommon.ExpectType<
			typeof DPrinter.dash,
			"-",
			"strict"
		>;

		expect(DPrinter.dash).toBe("-");
	});
});
