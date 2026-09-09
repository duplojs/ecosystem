import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("UuidConstraint", () => {
	it("creates a synchronous uuid constraint", () => {
		const constraint = DDataStructure.UuidConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UuidConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
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
