import { DDataStructure, type ExpectType } from "@scripts";

describe("StringLiteralType", () => {
	it("creates a synchronous string literal type", () => {
		const type = DDataStructure.StringLiteralType("value");

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.StringLiteralType<"value">,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			"value",
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheString);
		expect(type.definition).toEqual({ value: "value" });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DDataStructure.StringLiteralType("value");

		expect(type.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-string values through its fundamental type", () => {
		const type = DDataStructure.StringLiteralType("value");
		expect(type.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects another string value through its literal type", () => {
		const type = DDataStructure.StringLiteralType("value");
		expect(type.executeCheck("other")).toBe(DDataStructure.ErrorSymbol);
	});
});
