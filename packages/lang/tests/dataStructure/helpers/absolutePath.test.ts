import { DDataStructure, DEither, type DPath, type ExpectType } from "@scripts";

describe("absolutePath", () => {
	it("creates and applies an absolute path constraint", () => {
		const constraint = DDataStructure.absolutePath();
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("/src/index.ts");
		const failure = structure.check("src/index.ts");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.AbsolutePathConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DPath.Absolute,
			"strict"
		>;

		expect(constraint.executeCheck("/src/index.ts")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("src/index.ts")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", "/src/index.ts"),
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
