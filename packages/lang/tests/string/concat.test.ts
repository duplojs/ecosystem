import { DString, pipe, type ExpectType } from "@scripts";

describe("concat", () => {
	it("should append strings", () => {
		const result = DString.concat("hello", " ", "world");

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should append a string in pipe", () => {
		const result = pipe(
			"hello",
			DString.concat(" world"),
		);

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const suffix = "!" as "!" & DString.MaxCharacters<1>;
		const resultMin = DString.concat(sourceMin, suffix);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			`${string}!` & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.concat(sourceMax, suffix);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			`${string}!`,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.concat(sourceLength, suffix);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			`${string}!` & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
