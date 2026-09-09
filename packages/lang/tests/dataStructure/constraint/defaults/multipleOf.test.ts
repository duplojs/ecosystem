import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("MultipleOfConstraint", () => {
	it("creates a synchronous multiple of constraint", () => {
		const constraint = DDataStructure.MultipleOfConstraint(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MultipleOfConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.MultipleOf<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ multiple: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts multiples of the expected number", () => {
		const constraint = DDataStructure.MultipleOfConstraint(3);

		expect(constraint.executeCheck(6)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers that are not multiples without an error handler", () => {
		const constraint = DDataStructure.MultipleOfConstraint(3);

		expect(constraint.executeCheck(7)).toBe(DDataStructure.ErrorSymbol);
	});
});
