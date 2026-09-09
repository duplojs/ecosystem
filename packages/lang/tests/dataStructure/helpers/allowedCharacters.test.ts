import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("allowedCharacters", () => {
	it("creates and applies an allowed characters constraint", () => {
		const constraint = DDataStructure.allowedCharacters("a-z");
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("abc");
		const failure = structure.check("ABC");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.AllowedCharactersConstraint<"a-z">,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;

		expect(constraint.definition).toEqual({ charactersRange: "a-z" });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ABC")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "abc"));
		expect(structure.is("ABC")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
