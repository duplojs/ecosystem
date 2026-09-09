import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("IntegerConstraint", () => {
	it("creates a synchronous integer constraint", () => {
		const constraint = DDataStructure.IntegerConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.IntegerConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
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
