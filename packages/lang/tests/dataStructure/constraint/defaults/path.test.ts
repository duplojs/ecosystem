import { DDataStructure, type DPath, type ExpectType } from "@scripts";

describe("PathConstraint", () => {
	it("creates a synchronous path constraint", () => {
		const constraint = DDataStructure.PathConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.PathConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DPath.Path,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid path values", () => {
		const constraint = DDataStructure.PathConstraint();

		expect(constraint.executeCheck("src/index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("/src/index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid path values without an error handler", () => {
		const constraint = DDataStructure.PathConstraint();

		expect(constraint.executeCheck("")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("./src/index.ts")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("src/../index.ts")).toBe(DDataStructure.ErrorSymbol);
	});
});
