import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("NotZeroConstraint", () => {
	it("creates a synchronous non-zero number constraint", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.NotZeroConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.NotZero,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts non-zero numbers", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero without an error handler", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
	});
});
