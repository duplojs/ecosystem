import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("renderLine", () => {
	it("renders printable values separated by spaces", () => {
		const result = DPrinter.renderLine([
			"hello",
			["world", null],
			true,
		]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("hello world true");
	});
});
