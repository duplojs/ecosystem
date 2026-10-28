import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("GreaterThanOrEqualConstraint", () => {
	it("creates a synchronous greater than or equal constraint", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanOrEqualConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.GreaterThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers greater than or equal to the threshold", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(4)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers less than the threshold without an error handler", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});
});
