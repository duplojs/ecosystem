import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("UndefinedType", () => {
	it("creates a synchronous undefined type", () => {
		const type = DDataStructure.UndefinedType();

		type _CheckType = DCommon.ExpectType<
			typeof type,
			DDataStructure.UndefinedType,
			"strict"
		>;
		type _CheckTypeValue = DCommon.ExpectType<
			DDataStructure.TypeValue<typeof type>,
			undefined,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheUndefined);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts undefined values", () => {
		const type = DDataStructure.UndefinedType();

		expect(type.executeCheck(undefined)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-undefined values through its fundamental type", () => {
		const type = DDataStructure.UndefinedType();
		expect(type.executeCheck(null)).toBe(DDataStructure.ErrorSymbol);
	});
});
