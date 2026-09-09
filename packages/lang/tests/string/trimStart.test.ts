import { DString, type ExpectType } from "@scripts";

describe("trimStart", () => {
	it("should trim the start of a string", () => {
		const result = DString.trimStart("  hello  ");

		expect(result).toBe("hello  ");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<9>,
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMax = "  hello  " as string & DString.MaxCharacters<10>;
		const resultMax = DString.trimStart(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "  hello  " as string & DString.MinCharacters<3>;
		const resultMin = DString.trimStart(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "  hello  " as string & DString.LengthEqual<9>;
		const resultLength = DString.trimStart(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<9>,
			"strict"
		>;
	});
});
