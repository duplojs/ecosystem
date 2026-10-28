import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("BigintType", () => {
	it("creates a synchronous bigint type", () => {
		const type = DDataStructure.BigintType();

		type _CheckType = DCommon.ExpectType<
			typeof type,
			DDataStructure.BigintType,
			"strict"
		>;
		type _CheckTypeValue = DCommon.ExpectType<
			DDataStructure.TypeValue<typeof type>,
			bigint,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheBigint);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts bigint values", () => {
		const type = DDataStructure.BigintType();

		expect(type.executeCheck(12n)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-bigint values through its fundamental type", () => {
		const type = DDataStructure.BigintType();
		expect(type.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});
});
