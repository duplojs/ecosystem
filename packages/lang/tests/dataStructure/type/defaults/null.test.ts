import { DDataStructure, type ExpectType } from "@scripts";

describe("NullType", () => {
	it("creates a synchronous null type", () => {
		const type = DDataStructure.NullType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.NullType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			null,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheNull);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts null values", () => {
		const type = DDataStructure.NullType();

		expect(type.executeCheck(null)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-null values through its fundamental type", () => {
		const type = DDataStructure.NullType();
		expect(type.executeCheck(undefined)).toBe(DDataStructure.ErrorSymbol);
	});
});
