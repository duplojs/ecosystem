import { DDataStructure, type ExpectType } from "@scripts";

describe("BooleanLiteralType", () => {
	it("creates a synchronous boolean literal type", () => {
		const type = DDataStructure.BooleanLiteralType(true);

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.BooleanLiteralType<true>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			true,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheBoolean);
		expect(type.definition).toEqual({ value: true });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DDataStructure.BooleanLiteralType(true);

		expect(type.executeCheck(true)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-boolean values through its fundamental type", () => {
		const type = DDataStructure.BooleanLiteralType(true);
		expect(type.executeCheck("true")).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects another boolean value through its literal type", () => {
		const type = DDataStructure.BooleanLiteralType(true);
		expect(type.executeCheck(false)).toBe(DDataStructure.ErrorSymbol);
	});
});
