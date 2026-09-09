import { DDataStructure, DEither, DString, type ExpectType } from "@scripts";

describe("refine", () => {
	it("creates and applies a refine constraint", () => {
		const constraint = DDataStructure.refine(
			DString.startsWith("user:"),
		);
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("user:123");
		const failure = structure.check("admin:123");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.RefineConstraint<string, `user:${string}`>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			`user:${string}`,
			"strict"
		>;

		expect(constraint.executeCheck("user:123")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("admin:123")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "user:123"));
		expect(structure.is("admin:123")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
