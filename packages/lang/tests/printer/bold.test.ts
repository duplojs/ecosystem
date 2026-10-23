import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("bold", () => {
	it("formats text in bold", () => {
		const result = DPrinter.bold("value");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("\x1b[1mvalue\x1b[0m");
	});
});
