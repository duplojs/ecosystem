import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("StrictNegativeConstraint", () => {
	it("creates a synchronous strict negative number constraint", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StrictNegativeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.StrictNegative,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strictly negative numbers", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		expect(constraint.executeCheck(-1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero and positive numbers without an error handler", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
	});
});
