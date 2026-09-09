import { DDataStructure, type ExpectType } from "@scripts";

describe("StringType", () => {
	it("creates a synchronous string type", () => {
		const type = DDataStructure.StringType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.StringType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			string,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheString);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts string values", () => {
		const type = DDataStructure.StringType();

		expect(type.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-string values through its fundamental type", () => {
		const type = DDataStructure.StringType();
		expect(type.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});
});
