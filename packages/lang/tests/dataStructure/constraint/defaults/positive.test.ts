import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("PositiveConstraint", () => {
	it("creates a synchronous positive number constraint", () => {
		const constraint = DDataStructure.PositiveConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.PositiveConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Positive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts positive numbers and zero", () => {
		const constraint = DDataStructure.PositiveConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects negative numbers without an error handler", () => {
		const constraint = DDataStructure.PositiveConstraint();

		expect(constraint.executeCheck(-1)).toBe(DDataStructure.ErrorSymbol);
	});
});
