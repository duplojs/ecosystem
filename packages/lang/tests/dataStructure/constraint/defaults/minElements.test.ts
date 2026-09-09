import { DDataStructure, type DArray, type ExpectType } from "@scripts";

describe("MinElementsConstraint", () => {
	it("creates a synchronous minimum elements constraint", () => {
		const constraint = DDataStructure.MinElementsConstraint(2);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MinElementsConstraint<2>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DArray.MinElements<2>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 2 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts arrays with at least the minimum length", () => {
		const constraint = DDataStructure.MinElementsConstraint(2);

		expect(constraint.executeCheck([1, 2])).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck([1, 2, 3])).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects shorter arrays without an error handler", () => {
		const constraint = DDataStructure.MinElementsConstraint(2);

		expect(constraint.executeCheck([1])).toBe(DDataStructure.ErrorSymbol);
	});
});
