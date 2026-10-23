import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("OddConstraint", () => {
	it("creates a synchronous odd number constraint", () => {
		const constraint = DDataStructure.OddConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.OddConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Odd,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts odd numbers", () => {
		const constraint = DDataStructure.OddConstraint();

		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects even numbers without an error handler", () => {
		const constraint = DDataStructure.OddConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});
});
