import { DDataStructure, type ExpectType } from "@scripts";

describe("TheUndefined", () => {
	it("accepts undefined values", () => {
		const result = DDataStructure.TheUndefined.executeCheck(undefined);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheUndefined,
			DDataStructure.TheUndefined,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheUndefined>,
			undefined,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.undefinedFundamentalTypeKind.has(DDataStructure.TheUndefined)).toBe(true);
	});

	it("rejects non-undefined values without an error handler", () => {
		expect(DDataStructure.TheUndefined.executeCheck(null)).toBe(DDataStructure.ErrorSymbol);
	});
});
