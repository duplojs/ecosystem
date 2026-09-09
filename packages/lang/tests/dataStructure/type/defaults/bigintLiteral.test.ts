import { DDataStructure, type ExpectType } from "@scripts";

describe("BigintLiteralType", () => {
	it("creates a synchronous bigint literal type", () => {
		const type = DDataStructure.BigintLiteralType(12n);

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.BigintLiteralType<12n>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			12n,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheBigint);
		expect(type.definition).toEqual({ value: 12n });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DDataStructure.BigintLiteralType(12n);

		expect(type.executeCheck(12n)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-bigint values through its fundamental type", () => {
		const type = DDataStructure.BigintLiteralType(12n);
		expect(type.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects another bigint value through its literal type", () => {
		const type = DDataStructure.BigintLiteralType(12n);
		expect(type.executeCheck(24n)).toBe(DDataStructure.ErrorSymbol);
	});
});
