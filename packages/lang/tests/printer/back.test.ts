import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("Back", () => {
	it("exposes the supported line breaks", () => {
		type _Check = DCommon.ExpectType<DPrinter.Back, "LF" | "CRLF", "strict">;

		expect(DPrinter.Back.toTuple()).toStrictEqual(["LF", "CRLF"]);
	});
});
