import { DString, type ExpectType } from "@scripts";

describe("shift", () => {
	it("should remove the first character", () => {
		const result = DString.shift("hello");

		expect(result).toBe("ello");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<5>,
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.shift("")).toBe("");
	});

	it("should distribute constrained string unions before removing the first character", () => {
		const source = "hello" as
			| (string & DString.LengthEqual<0>)
			| (string & DString.LengthEqual<5>);
		const result = DString.shift(source);

		expect(result).toBe("ello");

		type _CheckResult = ExpectType<
			typeof result,
			| (string & DString.MaxCharacters<0>)
			| (string & DString.MaxCharacters<5>),
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMax = "hello" as string & DString.MaxCharacters<10>;
		const resultMax = DString.shift(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.shift(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.shift(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<5>,
			"strict"
		>;
	});
});
