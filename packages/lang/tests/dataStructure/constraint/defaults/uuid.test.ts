import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("UuidConstraint", () => {
	it("creates a synchronous uuid constraint", () => {
		const constraint = DDataStructure.UuidConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.UuidConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Uuid,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid uuid values", () => {
		const constraint = DDataStructure.UuidConstraint();

		expect(constraint.executeCheck("123e4567-e89b-12d3-a456-426614174000")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid uuid values without an error handler", () => {
		const constraint = DDataStructure.UuidConstraint();

		expect(constraint.executeCheck("not-a-uuid")).toBe(DDataStructure.ErrorSymbol);
	});
});
