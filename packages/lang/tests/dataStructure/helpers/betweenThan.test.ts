import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("betweenThan", () => {
	it("creates and applies a strict range constraint", () => {
		const constraint = DDataStructure.betweenThan(1, 3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(2);
		const failure = structure.check(1);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.BetweenThanConstraint<1, 3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.GreaterThan<1> & DNumber.LessThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({
			greater: 1,
			less: 3,
		});
		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 2));
		expect(structure.is(1)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
