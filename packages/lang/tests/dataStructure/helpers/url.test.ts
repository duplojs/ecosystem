import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("url", () => {
	it("creates and applies a url constraint", () => {
		const constraint = DDataStructure.url();
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("https://example.com");
		const failure = structure.check("not-url");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UrlConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.Url,
			"strict"
		>;

		expect(constraint.executeCheck("https://example.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("not-url")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", "https://example.com"),
		);
		expect(structure.is("not-url")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(constraint);
	});
});
