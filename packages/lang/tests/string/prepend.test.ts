import { DString, pipe, type ExpectType } from "@scripts";

describe("prepend", () => {
	it("should prepend strings", () => {
		const result = DString.prepend("world", "hello", " ");

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should prepend a string in pipe", () => {
		const result = pipe(
			"world",
			DString.prepend("hello "),
		);

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "world" as string & DString.MinCharacters<3>;
		const prefix = "hello " as "hello " & DString.MinCharacters<6>;
		const resultMin = DString.prepend(sourceMin, prefix);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			`hello ${string}` & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "world" as string & DString.MaxCharacters<5>;
		const resultMax = DString.prepend(sourceMax, prefix);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			`hello ${string}`,
			"strict"
		>;

		const sourceLength = "world" as string & DString.LengthEqual<5>;
		const resultLength = DString.prepend(sourceLength, prefix);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			`hello ${string}` & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
