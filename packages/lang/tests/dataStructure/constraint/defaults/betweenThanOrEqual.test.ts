import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("BetweenThanOrEqualConstraint", () => {
	it("creates a synchronous between than or equal constraint", () => {
		const constraint = DDataStructure.BetweenThanOrEqualConstraint(1, 3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.BetweenThanOrEqualConstraint<1, 3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.GreaterThanOrEqual<1> & DNumber.LessThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({
			greater: 1,
			less: 3,
		});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers inside or equal to the bounds", () => {
		const constraint = DDataStructure.BetweenThanOrEqualConstraint(1, 3);

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers outside the bounds without an error handler", () => {
		const constraint = DDataStructure.BetweenThanOrEqualConstraint(1, 3);

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(4)).toBe(DDataStructure.ErrorSymbol);
	});
});
