import { DPrinter, type ExpectType } from "@scripts";

describe("renderLine", () => {
	it("renders printable values separated by spaces", () => {
		const result = DPrinter.renderLine([
			"hello",
			["world", null],
			true,
		]);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("hello world true");
	});
});
