import { DString, type ExpectType } from "@scripts";

describe("pop", () => {
	it("should remove the last character", () => {
		const result = DString.pop("hello");

		expect(result).toBe("hell");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<5>,
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.pop("")).toBe("");
	});

	it("should distribute constrained string unions before removing the last character", () => {
		const source = "hello" as
			| (string & DString.LengthEqual<0>)
			| (string & DString.LengthEqual<5>);
		const result = DString.pop(source);

		expect(result).toBe("hell");

		type _CheckResult = ExpectType<
			typeof result,
			| (string & DString.MaxCharacters<0>)
			| (string & DString.MaxCharacters<5>),
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMax = "hello" as string & DString.MaxCharacters<10>;
		const resultMax = DString.pop(sourceMax);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.pop(sourceMin);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.pop(sourceLength);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<5>,
			"strict"
		>;
	});
});
