import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("TheUndefined", () => {
	it("accepts undefined values", () => {
		const result = DDataStructure.TheUndefined.executeCheck(undefined);

		type _CheckFundamentalType = DCommon.ExpectType<
			typeof DDataStructure.TheUndefined,
			DDataStructure.TheUndefined,
			"strict"
		>;
		type _CheckFundamentalValue = DCommon.ExpectType<
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
