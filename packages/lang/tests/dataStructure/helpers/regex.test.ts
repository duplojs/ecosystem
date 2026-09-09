import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("regex", () => {
	it("creates and applies a regex constraint", () => {
		const regex = /^contact@/;
		const constraint = DDataStructure.regex(regex);
		const structure = DDataStructure.string([constraint]);
		const validValue = "contact@mail.com";
		const success = structure.check(validValue);
		const failure = structure.check("value-error");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.RegexConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(constraint.executeCheck(validValue)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("value-error")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", validValue));
		expect(structure.is("value-error")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
