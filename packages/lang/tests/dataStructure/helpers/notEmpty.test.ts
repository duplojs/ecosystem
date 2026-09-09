import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("notEmpty", () => {
	it("creates and applies a non-empty string constraint", () => {
		const constraint = DDataStructure.notEmpty();
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("value");
		const failure = structure.check("");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.NotEmptyConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.NotEmpty,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(structure.is("")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
