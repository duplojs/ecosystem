import { DDataStructure, type DArray, type ExpectType } from "@scripts";

describe("ArrayLengthEqualConstraint", () => {
	it("creates a synchronous array length constraint", () => {
		const constraint = DDataStructure.ArrayLengthEqualConstraint(2);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.ArrayLengthEqualConstraint<2>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DArray.LengthEqual<2>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ length: 2 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts arrays with the expected length", () => {
		const constraint = DDataStructure.ArrayLengthEqualConstraint(2);

		expect(constraint.executeCheck([1, 2])).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects arrays with a different length without an error handler", () => {
		const constraint = DDataStructure.ArrayLengthEqualConstraint(2);

		expect(constraint.executeCheck([1])).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck([1, 2, 3])).toBe(DDataStructure.ErrorSymbol);
	});
});
