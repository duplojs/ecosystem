import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("MaxCharactersConstraint", () => {
	it("creates a synchronous string maximum constraint", () => {
		const constraint = DDataStructure.MaxCharactersConstraint(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MaxCharactersConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.MaxCharacters<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ max: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings with at most the maximum length", () => {
		const constraint = DDataStructure.MaxCharactersConstraint(3);

		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects longer strings without an error handler", () => {
		const constraint = DDataStructure.MaxCharactersConstraint(3);

		expect(constraint.executeCheck("abcd")).toBe(DDataStructure.ErrorSymbol);
	});
});
