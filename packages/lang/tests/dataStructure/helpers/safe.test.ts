import { DDataStructure, DEither, type DNumber, type ExpectType } from "@scripts";

describe("safe", () => {
	it("creates and applies a safe number constraint", () => {
		const constraint = DDataStructure.safe();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(0);
		const failure = structure.check(Number.MAX_SAFE_INTEGER);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.SafeConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.Safe,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(Number.MAX_SAFE_INTEGER)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(success).toStrictEqual(DEither.right("check-success", 0));
		expect(structure.is(Number.MAX_SAFE_INTEGER)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
