import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("LessThanOrEqualConstraint", () => {
	it("creates a synchronous less than or equal constraint", () => {
		const constraint = DDataStructure.LessThanOrEqualConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.LessThanOrEqualConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.LessThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers less than or equal to the threshold", () => {
		const constraint = DDataStructure.LessThanOrEqualConstraint(3);

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers greater than the threshold without an error handler", () => {
		const constraint = DDataStructure.LessThanOrEqualConstraint(3);

		expect(constraint.executeCheck(4)).toBe(DDataStructure.ErrorSymbol);
	});
});
