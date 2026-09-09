import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("uuid", () => {
	it("creates and applies a uuid constraint", () => {
		const constraint = DDataStructure.uuid();
		const structure = DDataStructure.string([constraint]);
		const value = "123e4567-e89b-12d3-a456-426614174000";
		const success = structure.check(value);
		const failure = structure.check("not-a-uuid");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UuidConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.Uuid,
			"strict"
		>;

		expect(constraint.executeCheck(value)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("not-a-uuid")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", value));
		expect(structure.is("not-a-uuid")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
