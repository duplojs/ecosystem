import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("GreaterThanOrEqualConstraint", () => {
	it("creates a synchronous greater than or equal constraint", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanOrEqualConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.GreaterThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers greater than or equal to the threshold", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(4)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers less than the threshold without an error handler", () => {
		const constraint = DDataStructure.GreaterThanOrEqualConstraint(3);

		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});
});
