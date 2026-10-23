import type * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("uncapitalize", () => {
	it("should uncapitalize the first character", () => {
		const result = DString.uncapitalize("Hello World");

		expect(result).toBe("hello World");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"hello World",
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.uncapitalize("")).toBe("");
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "Hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.uncapitalize(sourceMin);

		type _CheckMinResult = DCommon.ExpectType<
			typeof resultMin,
			Uncapitalize<string> & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "Hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.uncapitalize(sourceMax);

		type _CheckMaxResult = DCommon.ExpectType<
			typeof resultMax,
			Uncapitalize<string>,
			"strict"
		>;

		const sourceLength = "Hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.uncapitalize(sourceLength);

		type _CheckLengthResult = DCommon.ExpectType<
			typeof resultLength,
			Uncapitalize<string> & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
