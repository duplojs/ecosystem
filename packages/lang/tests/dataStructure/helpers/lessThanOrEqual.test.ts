import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("lessThanOrEqual", () => {
	it("creates and applies a less than or equal constraint", () => {
		const constraint = DDataStructure.lessThanOrEqual(3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(3);
		const failure = structure.check(4);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.LessThanOrEqualConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.LessThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(4)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 3));
		expect(structure.is(4)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
