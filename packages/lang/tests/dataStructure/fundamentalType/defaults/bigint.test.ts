import { DDataStructure, type ExpectType } from "@scripts";

describe("TheBigint", () => {
	it("accepts bigint values", () => {
		const result = DDataStructure.TheBigint.executeCheck(12n);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheBigint,
			DDataStructure.TheBigint,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheBigint>,
			bigint,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.bigintFundamentalTypeKind.has(DDataStructure.TheBigint)).toBe(true);
	});

	it("rejects non-bigint values without an error handler", () => {
		expect(DDataStructure.TheBigint.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});
});
