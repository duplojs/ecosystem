import { DDataStructure, type ExpectType } from "@scripts";

describe("result symbols", () => {
	it("exposes stable success and error symbols", () => {
		type _CheckSuccessSymbol = ExpectType<
			typeof DDataStructure.SuccessSymbol,
			DDataStructure.SuccessSymbol,
			"strict"
		>;
		type _CheckErrorSymbol = ExpectType<
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
