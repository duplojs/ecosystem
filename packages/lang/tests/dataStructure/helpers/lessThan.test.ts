import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("lessThan", () => {
	it("creates and applies a less than constraint", () => {
		const constraint = DDataStructure.lessThan(3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(2);
		const failure = structure.check(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.LessThanConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.LessThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 2));
		expect(structure.is(3)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
