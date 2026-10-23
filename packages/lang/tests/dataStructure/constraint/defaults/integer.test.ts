import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("IntegerConstraint", () => {
	it("creates a synchronous integer constraint", () => {
		const constraint = DDataStructure.IntegerConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.IntegerConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Integer,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts integer numbers", () => {
		const constraint = DDataStructure.IntegerConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects decimal numbers without an error handler", () => {
		const constraint = DDataStructure.IntegerConstraint();

		expect(constraint.executeCheck(2.5)).toBe(DDataStructure.ErrorSymbol);
	});
});
