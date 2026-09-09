import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("EmailConstraint", () => {
	it("creates a synchronous email constraint", () => {
		const constraint = DDataStructure.EmailConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.EmailConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Email,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid email values", () => {
		const constraint = DDataStructure.EmailConstraint();

		expect(constraint.executeCheck("user.name+tag@example-domain.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid email values without an error handler", () => {
		const constraint = DDataStructure.EmailConstraint();

		expect(constraint.executeCheck(".user@example.com")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("user@example")).toBe(DDataStructure.ErrorSymbol);
	});
});
