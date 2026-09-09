import { DPrinter, type ExpectType } from "@scripts";

describe("renderParagraph", () => {
	it("renders printable values separated by line breaks", () => {
		const result = DPrinter.renderParagraph([
			"title",
			["", "body"],
			false,
			true,
		]);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("title\n\nbody\ntrue");
	});
});
