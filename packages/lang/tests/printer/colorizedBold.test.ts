import { DPrinter, pipe, type ExpectType } from "@scripts";

describe("colorizedBold", () => {
	it("formats colorized text in bold with direct and curried calls", () => {
		const directResult = DPrinter.colorizedBold("value", "cyan");
		const curriedResult = pipe(
			"value",
			DPrinter.colorizedBold("cyan"),
		);

		type _CheckDirectResult = ExpectType<
			typeof directResult,
			string,
			"strict"
		>;
		type _CheckCurriedResult = ExpectType<
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
