import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import type * as DNumber from "@scripts/number";

describe("odd", () => {
	it("creates and applies an odd constraint", () => {
		const constraint = DDataStructure.odd();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(3);
		const failure = structure.check(2);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.OddConstraint,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.Odd,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
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
