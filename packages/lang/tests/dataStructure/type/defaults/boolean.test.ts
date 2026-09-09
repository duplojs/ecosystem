import { DDataStructure, type ExpectType } from "@scripts";

describe("BooleanType", () => {
	it("creates a synchronous boolean type", () => {
		const type = DDataStructure.BooleanType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.BooleanType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			boolean,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheBoolean);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts boolean values", () => {
		const type = DDataStructure.BooleanType();

		expect(type.executeCheck(true)).toBe(DDataStructure.SuccessSymbol);
		expect(type.executeCheck(false)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-boolean values through its fundamental type", () => {
		const type = DDataStructure.BooleanType();
		expect(type.executeCheck("true")).toBe(DDataStructure.ErrorSymbol);
	});
});
