import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("StringMinConstraint", () => {
	it("creates a synchronous string minimum constraint", () => {
		const constraint = DDataStructure.MinCharactersConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.MinCharactersConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.MinCharacters<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings with at least the minimum length", () => {
		const constraint = DDataStructure.MinCharactersConstraint(3);

		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("abcd")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects shorter strings without an error handler", () => {
		const constraint = DDataStructure.MinCharactersConstraint(3);

		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
	});
});
