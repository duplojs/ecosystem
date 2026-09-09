import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("StrictPositiveConstraint", () => {
	it("creates a synchronous strict positive number constraint", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StrictPositiveConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.StrictPositive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strictly positive numbers", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero and negative numbers without an error handler", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(-1)).toBe(DDataStructure.ErrorSymbol);
	});
});
