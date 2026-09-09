import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("even", () => {
	it("creates and applies an even constraint", () => {
		const constraint = DDataStructure.even();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(2);
		const failure = structure.check(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.EvenConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.Even,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
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
