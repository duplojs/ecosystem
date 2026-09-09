import { DString, pipe, type ExpectType } from "@scripts";

describe("slice", () => {
	it("should slice a string", () => {
		const result = DString.slice("hello world", 0, 5);

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<11>,
			"strict"
		>;
	});

	it("should slice a string in pipe", () => {
		const result = pipe(
			"hello world",
			DString.slice(6, 11),
		);

		expect(result).toBe("world");
	});

	it("should support negative indexes", () => {
		expect(DString.slice("hello", -4, -1)).toBe("ell");
	});

	it("should distribute constrained string unions before slicing", () => {
		const source = "hello" as
			| (string & DString.LengthEqual<0>)
			| (string & DString.LengthEqual<5>);
		const result = DString.slice(source, 0, 2);

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
		const resultMax = DString.slice(sourceMax, 1, 3);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string & DString.MaxCharacters<10>,
			"strict"
		>;

		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.slice(sourceMin, 1, 3);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.slice(sourceLength, 1, 3);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MaxCharacters<5>,
			"strict"
		>;

		const sourceAllowed = "hello" as string & DString.AllowedCharacters<"a-z">;
		const resultAllowed = DString.slice(sourceAllowed, 1, 3);

		type _CheckAllowedResult = ExpectType<
			typeof resultAllowed,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
