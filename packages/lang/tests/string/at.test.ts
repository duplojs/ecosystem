import { DString, pipe, type ExpectType } from "@scripts";

describe("at", () => {
	it("should return the character at a literal index", () => {
		const result = DString.at("hello", 1);

		expect(result).toBe("e");

		type _CheckResult = ExpectType<
			typeof result,
			"e",
			"strict"
		>;
	});

	it("should distribute string unions before returning the character at an index", () => {
		const source = "hello" as "hello" | "";
		const result = DString.at(source, 0);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			"h" | undefined,
			"strict"
		>;
	});

	it("should ignore constraints on literal strings", () => {
		const source = "abc" as "abc" & DString.LengthEqual<999>;
		const result = DString.at(source, 0);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a",
			"strict"
		>;
	});

	it("should return the character at a negative literal index in pipe", () => {
		const result = pipe(
			"hello",
			DString.at(-1),
		);

		expect(result).toBe("o");

		type _CheckResult = ExpectType<
			typeof result,
			"o",
			"strict"
		>;
	});

	it("should return undefined for an out of range literal index", () => {
		const result = DString.at("hello", 9);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return undefined for an empty literal string", () => {
		const result = DString.at("", 0);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should return a maybe character for a wide string", () => {
		const source = "hello" as string;
		const result = DString.at(source, 1);

		expect(result).toBe("e");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DString.LengthEqual<1>) | undefined,
			"strict"
		>;
	});

	it("should return a maybe character union for a literal string and wide index", () => {
		const index = 1 as number;
		const result = DString.at("abc", index);

		expect(result).toBe("b");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | "c" | undefined,
			"strict"
		>;
	});

	it("should return the character type when the index is covered by constraints", () => {
		const source = "hello" as string & DString.MinCharacters<2>;
		const positiveResult = DString.at(source, 1);
		const negativeResult = DString.at(source, -2);

		expect(positiveResult).toBe("e");
		expect(negativeResult).toBe("l");

		type _CheckPositiveResult = ExpectType<
			typeof positiveResult,
			string & DString.LengthEqual<1>,
			"strict"
		>;

		type _CheckNegativeResult = ExpectType<
			typeof negativeResult,
			string & DString.LengthEqual<1>,
			"strict"
		>;
	});

	it("should return undefined when the index is out of range by constraints", () => {
		const source = "hi" as string & DString.MaxCharacters<2>;
		const positiveResult = DString.at(source, 2);
		const negativeResult = DString.at(source, -3);

		expect(positiveResult).toBeUndefined();
		expect(negativeResult).toBeUndefined();

		type _CheckPositiveResult = ExpectType<
			typeof positiveResult,
			undefined,
			"strict"
		>;

		type _CheckNegativeResult = ExpectType<
			typeof negativeResult,
			undefined,
			"strict"
		>;
	});

	it("should use exact length constraints to decide if an index exists", () => {
		const source = "hi" as string & DString.LengthEqual<2>;
		const coveredResult = DString.at(source, 1);
		const outOfRangeResult = DString.at(source, 2);

		expect(coveredResult).toBe("i");
		expect(outOfRangeResult).toBeUndefined();

		type _CheckCoveredResult = ExpectType<
			typeof coveredResult,
			string & DString.LengthEqual<1>,
			"strict"
		>;

		type _CheckOutOfRangeResult = ExpectType<
			typeof outOfRangeResult,
			undefined,
			"strict"
		>;
	});

	it("should return undefined for an empty constrained string with a wide index", () => {
		const source = "" as string & DString.LengthEqual<0>;
		const index = 0 as number;
		const result = DString.at(source, index);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should preserve allowed characters on constrained outputs", () => {
		const source = "hello" as string & DString.MinCharacters<1> & DString.AllowedCharacters<"a-z">;
		const result = DString.at(source, 0);

		expect(result).toBe("h");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.LengthEqual<1> & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
