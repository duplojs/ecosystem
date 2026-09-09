import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("positive", () => {
	it("creates and applies a positive constraint", () => {
		const constraint = DDataStructure.positive();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(0);
		const failure = structure.check(-1);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.PositiveConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.Positive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(-1)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 0));
		expect(structure.is(-1)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
