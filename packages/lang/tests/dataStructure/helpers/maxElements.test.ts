import { DDataStructure, DEither, type DArray, type ExpectType } from "@scripts";

describe("maxElements", () => {
	it("creates and applies a maximum elements constraint", () => {
		const constraint = DDataStructure.maxElements(2);
		const structure = DDataStructure.array(DDataStructure.number(), [constraint]);
		const success = structure.check([1, 2]);
		const failure = structure.check([1, 2, 3]);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.MaxElementsConstraint<2>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			readonly number[] & DArray.MaxElements<2>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ max: 2 });
		expect(constraint.executeCheck([1, 2])).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck([1, 2, 3])).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", [1, 2]));
		expect(structure.is([1, 2, 3])).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
