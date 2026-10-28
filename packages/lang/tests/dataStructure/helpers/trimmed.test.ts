import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import type * as DString from "@scripts/string";

describe("trimmed", () => {
	it("creates and applies a trimmed string constraint", () => {
		const constraint = DDataStructure.trimmed();
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("value");
		const failure = structure.check(" value ");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.TrimmedConstraint,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.Trimmed,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(" value ")).toBe(DDataStructure.ErrorSymbol);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(structure.is(" value ")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
