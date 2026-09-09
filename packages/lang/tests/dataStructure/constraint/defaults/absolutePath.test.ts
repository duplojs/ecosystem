import { DDataStructure, type DPath, type ExpectType } from "@scripts";

describe("AbsolutePathConstraint", () => {
	it("creates a synchronous absolute path constraint", () => {
		const constraint = DDataStructure.AbsolutePathConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.AbsolutePathConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DPath.Absolute,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid absolute path values", () => {
		const constraint = DDataStructure.AbsolutePathConstraint();

		expect(constraint.executeCheck("/src/index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("/")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects relative or invalid path values without an error handler", () => {
		const constraint = DDataStructure.AbsolutePathConstraint();

		expect(constraint.executeCheck("src/index.ts")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("/src/../index.ts")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("")).toBe(DDataStructure.ErrorSymbol);
	});
});
