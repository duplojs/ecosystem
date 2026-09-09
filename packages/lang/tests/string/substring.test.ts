import { DString, pipe, type ExpectType } from "@scripts";

describe("substring", () => {
	it("should extract a substring", () => {
		const result = DString.substring("hello world", 0, 5);

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<11>,
			"strict"
		>;
	});

	it("should extract a substring without an end index", () => {
		expect(DString.substring("hello world", 6)).toBe("world");
	});

	it("should extract a substring in pipe", () => {
		const result = pipe(
			"hello world",
			DString.substring(6),
		);

		expect(result).toBe("world");
	});

	it("should follow native substring bounds behavior", () => {
		expect(DString.substring("hello", 4, 1)).toBe("ell");
		expect(DString.substring("hello", -2, 2)).toBe("he");
	});

	it("should distribute constrained string unions before extracting a substring", () => {
		const source = "hello" as
			| (string & DString.LengthEqual<0>)
			| (string & DString.LengthEqual<5>);
		const result = DString.substring(source, 0, 2);

		expect(result).toBe("he");

		type _CheckResult = ExpectType<
			typeof result,
			| (string & DString.MaxCharacters<0>)
			| (string & DString.MaxCharacters<5>),
			"strict"
		>;
	});

	it("should preserve only compatible constraints", () => {
		const sourceMax = "hello" as string & DString.MaxCharacters<10>;
		const resultMax = DString.substring(sourceMax, 1, 3);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.substring(sourceMin, 1, 3);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.substring(sourceLength, 1, 3);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<5>,
			"strict"
		>;

		const sourceAllowed = "hello" as string & DString.AllowedCharacters<"a-z">;
		const resultAllowed = DString.substring(sourceAllowed, 1, 3);

		type _CheckAllowedResult = ExpectType<
			typeof resultAllowed,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
