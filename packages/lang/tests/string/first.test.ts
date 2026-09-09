import { DString, type ExpectType } from "@scripts";

describe("first", () => {
	it("should return the first literal character", () => {
		const result = DString.first("hello");

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			"h",
			"strict"
		>;
	});

	it("should distribute string unions before returning the first character", () => {
		const source = "hello" as "hello" | "";
		const result = DString.first(source);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			"h" | undefined,
			"strict"
		>;
	});

	it("should ignore constraints on literal strings", () => {
		const source = "abc" as "abc" & DString.LengthEqual<999>;
		const result = DString.first(source);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a",
			"strict"
		>;
	});

	it("should return undefined for an empty literal string", () => {
		const result = DString.first("");

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return a maybe character for a wide string", () => {
		const source = "hello" as string;
		const result = DString.first(source);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DString.LengthEqual<1>) | undefined,
			"strict"
		>;
	});

	it("should return the character type for a non-empty constrained string", () => {
		const source = "hello" as string & DString.MinCharacters<1>;
		const result = DString.first(source);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.LengthEqual<1>,
			"strict"
		>;
	});

	it("should return undefined for an empty constrained string", () => {
		const source = "" as string & DString.LengthEqual<0>;
		const result = DString.first(source);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should preserve allowed characters on constrained outputs", () => {
		const source = "hello" as string & DString.MinCharacters<1> & DString.AllowedCharacters<"a-z">;
		const result = DString.first(source);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.LengthEqual<1> & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
