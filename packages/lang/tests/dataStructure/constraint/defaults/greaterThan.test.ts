import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("GreaterThanConstraint", () => {
	it("creates a synchronous greater than constraint", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.GreaterThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers greater than the threshold", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		expect(constraint.executeCheck(4)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers less than or equal to the threshold without an error handler", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});
});
