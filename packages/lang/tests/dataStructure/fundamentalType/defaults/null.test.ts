import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("TheNull", () => {
	it("accepts null values", () => {
		const result = DDataStructure.TheNull.executeCheck(null);

		type _CheckFundamentalType = DCommon.ExpectType<
			typeof DDataStructure.TheNull,
			DDataStructure.TheNull,
			"strict"
		>;
		type _CheckFundamentalValue = DCommon.ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheNull>,
			null,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.nullFundamentalTypeKind.has(DDataStructure.TheNull)).toBe(true);
	});

	it("rejects non-null values without an error handler", () => {
		expect(DDataStructure.TheNull.executeCheck(undefined)).toBe(DDataStructure.ErrorSymbol);
	});
});
