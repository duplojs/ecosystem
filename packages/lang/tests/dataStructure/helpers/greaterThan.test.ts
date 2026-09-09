import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("greaterThan", () => {
	it("creates and applies a greater than constraint", () => {
		const constraint = DDataStructure.greaterThan(3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(4);
		const failure = structure.check(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.GreaterThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.executeCheck(4)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 4));
		expect(structure.is(3)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
