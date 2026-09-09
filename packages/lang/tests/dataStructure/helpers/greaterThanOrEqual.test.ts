import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("greaterThanOrEqual", () => {
	it("creates and applies a greater than or equal constraint", () => {
		const constraint = DDataStructure.greaterThanOrEqual(3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(3);
		const failure = structure.check(2);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanOrEqualConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.GreaterThanOrEqual<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 3));
		expect(structure.is(2)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
