import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("EvenConstraint", () => {
	it("creates a synchronous even number constraint", () => {
		const constraint = DDataStructure.EvenConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.EvenConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Even,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts even numbers", () => {
		const constraint = DDataStructure.EvenConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects odd numbers without an error handler", () => {
		const constraint = DDataStructure.EvenConstraint();

		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
	});
});
