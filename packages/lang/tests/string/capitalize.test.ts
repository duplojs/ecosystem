import type * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("capitalize", () => {
	it("should capitalize the first character", () => {
		const result = DString.capitalize("hello world");

		expect(result).toBe("Hello world");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"Hello world",
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.capitalize("")).toBe("");
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.capitalize(sourceMin);

		type _CheckMinResult = DCommon.ExpectType<
			typeof resultMin,
			Capitalize<string> & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.capitalize(sourceMax);

		type _CheckMaxResult = DCommon.ExpectType<
			typeof resultMax,
			Capitalize<string>,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.capitalize(sourceLength);

		type _CheckLengthResult = DCommon.ExpectType<
			typeof resultLength,
			Capitalize<string> & DString.LengthEqual<5>,
			"strict"
		>;
	});
});
