import { DDataStructure, type DPath, type ExpectType } from "@scripts";

describe("SegmentPathConstraint", () => {
	it("creates a synchronous segment path constraint", () => {
		const constraint = DDataStructure.SegmentPathConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.SegmentPathConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DPath.Segment,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid segment path values", () => {
		const constraint = DDataStructure.SegmentPathConstraint();

		expect(constraint.executeCheck("src")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck(".git")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid segment path values without an error handler", () => {
		const constraint = DDataStructure.SegmentPathConstraint();

		expect(constraint.executeCheck("")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(".")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("..")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("src/index.ts")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("src\0index.ts")).toBe(DDataStructure.ErrorSymbol);
	});
});
