import { DString, type ExpectType } from "@scripts";

describe("last", () => {
	it("should return the last literal character", () => {
		const result = DString.last("hello");

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			"o",
			"strict"
		>;
	});

	it("should distribute string unions before returning the last character", () => {
		const source = "hello" as "hello" | "";
		const result = DString.last(source);

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			"o" | undefined,
			"strict"
		>;
	});

	it("should ignore constraints on literal strings", () => {
		const source = "abc" as "abc" & DString.LengthEqual<999>;
		const result = DString.last(source);

		expect(result).toBe("c");

		type _CheckResult = ExpectType<
			typeof result,
			"c",
			"strict"
		>;
	});

	it("should return undefined for an empty literal string", () => {
		const result = DString.last("");

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return a maybe character for a wide string", () => {
		const source = "hello" as string;
		const result = DString.last(source);

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DString.LengthEqual<1>) | undefined,
			"strict"
		>;
	});

	it("should return the character type for a non-empty constrained string", () => {
		const source = "hello" as string & DString.MinCharacters<1>;
		const result = DString.last(source);

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.LengthEqual<1>,
			"strict"
		>;
	});

	it("should return undefined for an empty constrained string", () => {
		const source = "" as string & DString.LengthEqual<0>;
		const result = DString.last(source);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should preserve allowed characters on constrained outputs", () => {
		const source = "hello" as string & DString.MinCharacters<1> & DString.AllowedCharacters<"a-z">;
		const result = DString.last(source);

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.LengthEqual<1> & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
