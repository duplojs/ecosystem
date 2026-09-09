import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("maxCharacters", () => {
	it("creates and applies a maximum characters constraint", () => {
		const constraint = DDataStructure.maxCharacters(3);
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("abc");
		const failure = structure.check("abcd");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MaxCharactersConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.MaxCharacters<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ max: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("abcd")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "abc"));
		expect(structure.is("abcd")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
