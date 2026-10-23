import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("LessThanConstraint", () => {
	it("creates a synchronous less than constraint", () => {
		const constraint = DDataStructure.LessThanConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.LessThanConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.LessThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers less than the threshold", () => {
		const constraint = DDataStructure.LessThanConstraint(3);

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers greater than or equal to the threshold without an error handler", () => {
		const constraint = DDataStructure.LessThanConstraint(3);

		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(4)).toBe(DDataStructure.ErrorSymbol);
	});
});
