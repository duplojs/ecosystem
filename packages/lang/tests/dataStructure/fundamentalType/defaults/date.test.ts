import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("TheDate", () => {
	it("accepts chrono date values", () => {
		const value = DChrono.createDateOrThrow(0);
		const result = DDataStructure.TheDate.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheDate,
			DDataStructure.TheDate,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheDate>,
			DChrono.TheDate,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.dateFundamentalTypeKind.has(DDataStructure.TheDate)).toBe(true);
	});

	it("rejects non-chrono date values without an error handler", () => {
		expect(DDataStructure.TheDate.executeCheck(new Date(0))).toBe(DDataStructure.ErrorSymbol);
	});
});
