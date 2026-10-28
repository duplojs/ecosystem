import * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("colorized", () => {
	it("colorizes text with direct and curried calls", () => {
		const directResult = DPrinter.colorized("value", "red");
		const curriedResult = DCommon.pipe(
			"value",
			DPrinter.colorized("red"),
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

		expect(directResult).toBe("\x1b[31mvalue\x1b[0m");
		expect(curriedResult).toBe("\x1b[31mvalue\x1b[0m");
	});

	it("rejects invalid color names", () => {
		if (false) {
			// @ts-expect-error color must be a known Printer color.
			DPrinter.colorized("value", "white");
		}
	});
});
