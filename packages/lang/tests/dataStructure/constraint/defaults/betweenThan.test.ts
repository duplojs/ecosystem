import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("BetweenThanConstraint", () => {
	it("creates a synchronous between than constraint", () => {
		const constraint = DDataStructure.BetweenThanConstraint(1, 3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.BetweenThanConstraint<1, 3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.GreaterThan<1> & DNumber.LessThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({
			greater: 1,
			less: 3,
		});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers strictly between the bounds", () => {
		const constraint = DDataStructure.BetweenThanConstraint(1, 3);

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers outside or equal to the bounds without an error handler", () => {
		const constraint = DDataStructure.BetweenThanConstraint(1, 3);

		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
	});
});
