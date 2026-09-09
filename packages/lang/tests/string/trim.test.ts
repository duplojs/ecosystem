import { DString, type ExpectType } from "@scripts";

describe("trim", () => {
	it("should trim both sides of a string", () => {
		const result = DString.trim("  hello  ");

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.Trimmed & DString.MaxCharacters<9>,
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMax = "  hello  " as string & DString.MaxCharacters<10>;
		const resultMax = DString.trim(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.Trimmed & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "  hello  " as string & DString.MinCharacters<3>;
		const resultMin = DString.trim(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string & DString.Trimmed,
			"strict"
		>;

		const sourceLength = "  hello  " as string & DString.LengthEqual<9>;
		const resultLength = DString.trim(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.Trimmed & DString.MaxCharacters<9>,
			"strict"
		>;
	});
});
