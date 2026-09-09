import { DDataStructure, type ExpectType } from "@scripts";

describe("TheNumber", () => {
	it("accepts number values", () => {
		const result = DDataStructure.TheNumber.executeCheck(12);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheNumber,
			DDataStructure.TheNumber,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheNumber>,
			number,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DDataStructure.numberFundamentalTypeKind.has(DDataStructure.TheNumber)).toBe(true);
	});

	it("rejects non-number values without an error handler", () => {
		expect(DDataStructure.TheNumber.executeCheck("12")).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects infinite numbers", () => {
		expect(DDataStructure.TheNumber.executeCheck(Infinity)).toBe(DDataStructure.ErrorSymbol);
		expect(DDataStructure.TheNumber.executeCheck(-Infinity)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects NaN values", () => {
		expect(DDataStructure.TheNumber.executeCheck(Number.NaN)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects a NaN value when the finite check passes", () => {
		const isFiniteSpy = vi
			.spyOn(globalThis, "isFinite")
			.mockReturnValueOnce(true);

		expect(DDataStructure.TheNumber.executeCheck(Number.NaN)).toBe(DDataStructure.ErrorSymbol);
		expect(isFiniteSpy).toHaveBeenCalledWith(Number.NaN);
		isFiniteSpy.mockRestore();
	});
});
