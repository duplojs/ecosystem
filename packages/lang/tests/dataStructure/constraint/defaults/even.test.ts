import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("EvenConstraint", () => {
	it("creates a synchronous even number constraint", () => {
		const constraint = DDataStructure.EvenConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.EvenConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Even,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts even numbers", () => {
		const constraint = DDataStructure.EvenConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects odd numbers without an error handler", () => {
		const constraint = DDataStructure.EvenConstraint();

		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
	});
});
