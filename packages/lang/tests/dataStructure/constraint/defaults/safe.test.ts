import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("SafeConstraint", () => {
	it("creates a synchronous safe number constraint", () => {
		const constraint = DDataStructure.SafeConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.SafeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Safe,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts safe numbers", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects unsafe numbers without an error handler", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(Number.MAX_SAFE_INTEGER)).toBe(
			DDataStructure.ErrorSymbol,
		);
	});
});
