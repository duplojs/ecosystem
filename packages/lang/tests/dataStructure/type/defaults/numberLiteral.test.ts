import { DDataStructure, type ExpectType } from "@scripts";

describe("NumberLiteralType", () => {
	it("creates a synchronous number literal type", () => {
		const type = DDataStructure.NumberLiteralType(12);

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.NumberLiteralType<12>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			12,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheNumber);
		expect(type.definition).toEqual({ value: 12 });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DDataStructure.NumberLiteralType(12);

		expect(type.executeCheck(12)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-number values through its fundamental type", () => {
		const type = DDataStructure.NumberLiteralType(12);
		expect(type.executeCheck("12")).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects another number value through its literal type", () => {
		const type = DDataStructure.NumberLiteralType(12);
		expect(type.executeCheck(24)).toBe(DDataStructure.ErrorSymbol);
	});
});
