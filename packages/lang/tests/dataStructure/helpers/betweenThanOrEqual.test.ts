import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("betweenThanOrEqual", () => {
	it("creates and applies an inclusive range constraint", () => {
		const constraint = DDataStructure.betweenThanOrEqual(1, 3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(1);
		const failure = structure.check(0);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.BetweenThanOrEqualConstraint<1, 3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.GreaterThanOrEqual<1> & DNumber.LessThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({
			greater: 1,
			less: 3,
		});
		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 1));
		expect(structure.is(0)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
