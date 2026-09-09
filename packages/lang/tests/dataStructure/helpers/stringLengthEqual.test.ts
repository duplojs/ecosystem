import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("stringLengthEqual", () => {
	it("creates and applies a string length equality constraint", () => {
		const constraint = DDataStructure.stringLengthEqual(3);
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("abc");
		const failure = structure.check("ab");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StringLengthEqualConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.LengthEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ length: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "abc"));
		expect(structure.is("ab")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
