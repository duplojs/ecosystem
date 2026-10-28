import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("NumberType", () => {
	it("creates a synchronous number type", () => {
		const type = DDataStructure.NumberType();

		type _CheckType = DCommon.ExpectType<
			typeof type,
			DDataStructure.NumberType,
			"strict"
		>;
		type _CheckTypeValue = DCommon.ExpectType<
			DDataStructure.TypeValue<typeof type>,
			number,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheNumber);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts number values", () => {
		const type = DDataStructure.NumberType();

		expect(type.executeCheck(12)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-number values through its fundamental type", () => {
		const type = DDataStructure.NumberType();
		expect(type.executeCheck("12")).toBe(DDataStructure.ErrorSymbol);
	});
});
