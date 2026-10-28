import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("NumberInStringConstraint", () => {
	it("creates a synchronous number in string constraint", () => {
		const constraint = DDataStructure.NumberInStringConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.NumberInStringConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Number,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid number string values", () => {
		const constraint = DDataStructure.NumberInStringConstraint();

		expect(constraint.executeCheck("12.5")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("-1e3")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid number string values without an error handler", () => {
		const constraint = DDataStructure.NumberInStringConstraint();

		expect(constraint.executeCheck("not-a-number")).toBe(DDataStructure.ErrorSymbol);
	});
});
