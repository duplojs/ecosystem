import { DDataStructure, DEither, type DPath, type ExpectType } from "@scripts";

describe("segmentPath", () => {
	it("creates and applies a segment path constraint", () => {
		const constraint = DDataStructure.segmentPath();
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("index.ts");
		const failure = structure.check("src/index.ts");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.SegmentPathConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DPath.Segment,
			"strict"
		>;

		expect(constraint.executeCheck("index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("src/index.ts")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", "index.ts"),
		);
		expect(structure.is("src/index.ts")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
