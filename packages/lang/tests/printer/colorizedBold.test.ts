import * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("colorizedBold", () => {
	it("formats colorized text in bold with direct and curried calls", () => {
		const directResult = DPrinter.colorizedBold("value", "cyan");
		const curriedResult = DCommon.pipe(
			"value",
			DPrinter.colorizedBold("cyan"),
		);

		type _CheckDirectResult = DCommon.ExpectType<
			typeof directResult,
			string,
			"strict"
		>;
		type _CheckCurriedResult = DCommon.ExpectType<
			typeof curriedResult,
			string,
			"strict"
		>;

		expect(directResult).toBe("\x1b[1m\x1b[36mvalue\x1b[0m\x1b[0m");
		expect(curriedResult).toBe("\x1b[1m\x1b[36mvalue\x1b[0m\x1b[0m");
	});

	it("rejects invalid color names", () => {
		if (false) {
			// @ts-expect-error color must be a known Printer color.
			DPrinter.colorizedBold("value", "white");
		}
	});
});
