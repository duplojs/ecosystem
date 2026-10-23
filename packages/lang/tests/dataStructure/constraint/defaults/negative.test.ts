import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("NegativeConstraint", () => {
	it("creates a synchronous negative number constraint", () => {
		const constraint = DDataStructure.NegativeConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.NegativeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Negative,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts negative numbers and zero", () => {
		const constraint = DDataStructure.NegativeConstraint();

		expect(constraint.executeCheck(-1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects positive numbers without an error handler", () => {
		const constraint = DDataStructure.NegativeConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
	});
});
