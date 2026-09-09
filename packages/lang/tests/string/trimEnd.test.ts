import { DString, type ExpectType } from "@scripts";

describe("trimEnd", () => {
	it("should trim the end of a string", () => {
		const result = DString.trimEnd("  hello  ");

		expect(result).toBe("  hello");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<9>,
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMax = "  hello  " as string & DString.MaxCharacters<10>;
		const resultMax = DString.trimEnd(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "  hello  " as string & DString.MinCharacters<3>;
		const resultMin = DString.trimEnd(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "  hello  " as string & DString.LengthEqual<9>;
		const resultLength = DString.trimEnd(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<9>,
			"strict"
		>;
	});
});
