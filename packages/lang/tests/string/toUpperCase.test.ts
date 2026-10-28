import type * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("toUpperCase", () => {
	it("should convert string to upper case", () => {
		const result = DString.toUpperCase("hello");

		expect(result).toBe("HELLO");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"HELLO",
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.toUpperCase(sourceMin);

		type _CheckMinResult = DCommon.ExpectType<
			typeof resultMin,
			Uppercase<string> & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.toUpperCase(sourceMax);

		type _CheckMaxResult = DCommon.ExpectType<
			typeof resultMax,
			Uppercase<string>,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.toUpperCase(sourceLength);

		type _CheckLengthResult = DCommon.ExpectType<
			typeof resultLength,
			Uppercase<string> & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
