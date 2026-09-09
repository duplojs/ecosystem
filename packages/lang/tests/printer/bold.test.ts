import { DPrinter, type ExpectType } from "@scripts";

describe("bold", () => {
	it("formats text in bold", () => {
		const result = DPrinter.bold("value");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("\x1b[1mvalue\x1b[0m");
	});
});
