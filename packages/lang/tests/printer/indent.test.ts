import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("Indent", () => {
	it("exposes tab and the four space widths", () => {
		type _Check = DCommon.ExpectType<DPrinter.Indent, "tab" | "space1" | "space2" | "space3" | "space4", "strict">;

		expect(DPrinter.Indent.toTuple()).toStrictEqual(["tab", "space1", "space2", "space3", "space4"]);
	});
});
