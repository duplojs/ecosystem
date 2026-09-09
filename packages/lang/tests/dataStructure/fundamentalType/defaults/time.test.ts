import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("TheTime", () => {
	it("accepts chrono time values", () => {
		const value = DChrono.createTimeOrThrow(0);
		const result = DDataStructure.TheTime.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheTime,
			DDataStructure.TheTime,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheTime>,
			DChrono.TheTime,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.timeFundamentalTypeKind.has(DDataStructure.TheTime)).toBe(true);
	});

	it("rejects non-chrono time values without an error handler", () => {
		expect(DDataStructure.TheTime.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
	});
});
