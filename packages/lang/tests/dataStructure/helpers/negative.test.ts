import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("negative", () => {
	it("creates and applies a negative constraint", () => {
		const constraint = DDataStructure.negative();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(-1);
		const failure = structure.check(1);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.NegativeConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.Negative,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.executeCheck(-1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", -1));
		expect(structure.is(1)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
