import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import type * as DNumber from "@scripts/number";

describe("strictPositive", () => {
	it("creates and applies a strict positive constraint", () => {
		const constraint = DDataStructure.strictPositive();
		const structure = DDataStructure.number([constraint]);
		const success = structure.check(1);
		const failure = structure.check(0);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.StrictPositiveConstraint,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number & DNumber.StrictPositive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
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
