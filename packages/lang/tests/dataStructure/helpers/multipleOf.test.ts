import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("multipleOf", () => {
	it("creates and applies a multiple of constraint", () => {
		const constraint = DDataStructure.multipleOf(3);
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(6);
		const failure = structure.check(7);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MultipleOfConstraint<3>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.MultipleOf<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ multiple: 3 });
		expect(constraint.executeCheck(6)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(7)).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", 6));
		expect(structure.is(7)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
