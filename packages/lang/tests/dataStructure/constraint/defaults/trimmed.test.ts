import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("TrimmedConstraint", () => {
	it("creates a synchronous trimmed string constraint", () => {
		const constraint = DDataStructure.TrimmedConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.TrimmedConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Trimmed,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts trimmed strings", () => {
		const constraint = DDataStructure.TrimmedConstraint();

		expect(constraint.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects untrimmed strings without an error handler", () => {
		const constraint = DDataStructure.TrimmedConstraint();

		expect(constraint.executeCheck(" value")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("value ")).toBe(DDataStructure.ErrorSymbol);
	});
});
