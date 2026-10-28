import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("BigintLiteralType", () => {
	it("creates a synchronous bigint literal type", () => {
		const type = DDataStructure.BigintLiteralType(12n);

		type _CheckType = DCommon.ExpectType<
			typeof type,
			DDataStructure.BigintLiteralType<12n>,
			"strict"
		>;
		type _CheckTypeValue = DCommon.ExpectType<
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
