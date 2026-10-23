import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("result symbols", () => {
	it("exposes stable success and error symbols", () => {
		type _CheckSuccessSymbol = DCommon.ExpectType<
			typeof DDataStructure.SuccessSymbol,
			DDataStructure.SuccessSymbol,
			"strict"
		>;
		type _CheckErrorSymbol = DCommon.ExpectType<
			typeof DDataStructure.ErrorSymbol,
			DDataStructure.ErrorSymbol,
			"strict"
		>;

		expect(typeof DDataStructure.SuccessSymbol).toBe("symbol");
		expect(typeof DDataStructure.ErrorSymbol).toBe("symbol");
		expect(DDataStructure.SuccessSymbol).not.toBe(DDataStructure.ErrorSymbol);
		expect(String(DDataStructure.SuccessSymbol)).toBe("Symbol(SuccessSymbol)");
		expect(String(DDataStructure.ErrorSymbol)).toBe("Symbol(ErrorSymbol)");
	});
});
