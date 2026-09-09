import { DDataStructure, type ExpectType } from "@scripts";

describe("TheString", () => {
	it("accepts string values", () => {
		const result = DDataStructure.TheString.executeCheck("value");

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheString,
			DDataStructure.TheString,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheString>,
			string,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.stringFundamentalTypeKind.has(DDataStructure.TheString)).toBe(true);
	});

	it("rejects non-string values without an error handler", () => {
		expect(DDataStructure.TheString.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});
});
