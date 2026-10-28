import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DNumber from "@scripts/number";

describe("SafeConstraint", () => {
	it("creates a synchronous safe number constraint", () => {
		const constraint = DDataStructure.SafeConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.SafeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Safe,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts safe numbers", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects unsafe numbers without an error handler", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(Number.MAX_SAFE_INTEGER)).toBe(
			DDataStructure.ErrorSymbol,
		);
	});
});
