import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("renderParagraph", () => {
	it("renders printable values separated by line breaks", () => {
		const result = DPrinter.renderParagraph([
			"title",
			["", "body"],
			false,
			true,
		]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("title\n\nbody\ntrue");
	});
});
