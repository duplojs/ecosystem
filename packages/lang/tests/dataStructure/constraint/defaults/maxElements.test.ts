import { DDataStructure, type DArray, type ExpectType } from "@scripts";

describe("MaxElementsConstraint", () => {
	it("creates a synchronous maximum elements constraint", () => {
		const constraint = DDataStructure.MaxElementsConstraint(2);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MaxElementsConstraint<2>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DArray.MaxElements<2>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ max: 2 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts arrays with at most the maximum length", () => {
		const constraint = DDataStructure.MaxElementsConstraint(2);

		expect(constraint.executeCheck([1, 2])).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck([1])).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects longer arrays without an error handler", () => {
		const constraint = DDataStructure.MaxElementsConstraint(2);

		expect(constraint.executeCheck([1, 2, 3])).toBe(DDataStructure.ErrorSymbol);
	});
});
