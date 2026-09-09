import { DString, type ExpectType } from "@scripts";

describe("toLowerCase", () => {
	it("should convert string to lower case", () => {
		const result = DString.toLowerCase("HELLO");

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			"hello",
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "HELLO" as string & DString.MinCharacters<3>;
		const resultMin = DString.toLowerCase(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			Lowercase<string> & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "HELLO" as string & DString.MaxCharacters<5>;
		const resultMax = DString.toLowerCase(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			Lowercase<string>,
			"strict"
		>;

		const sourceLength = "HELLO" as string & DString.LengthEqual<5>;
		const resultLength = DString.toLowerCase(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			Lowercase<string> & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
