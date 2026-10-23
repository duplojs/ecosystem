import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("StringLengthEqualConstraint", () => {
	it("creates a synchronous string length constraint", () => {
		const constraint = DDataStructure.StringLengthEqualConstraint(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.StringLengthEqualConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.LengthEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ length: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings with the expected length", () => {
		const constraint = DDataStructure.StringLengthEqualConstraint(3);

		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects strings with a different length without an error handler", () => {
		const constraint = DDataStructure.StringLengthEqualConstraint(3);

		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("abcd")).toBe(DDataStructure.ErrorSymbol);
	});
});
