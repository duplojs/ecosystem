import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("concat", () => {
	it("should append strings", () => {
		const result = DString.concat("hello", " ", "world");

		expect(result).toBe("hello world");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should append a string in pipe", () => {
		const result = DCommon.pipe(
			"hello",
			DString.concat(" world"),
		);

		expect(result).toBe("hello world");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const suffix = "!" as "!" & DString.MaxCharacters<1>;
		const resultMin = DString.concat(sourceMin, suffix);

		type _CheckMinResult = DCommon.ExpectType<
			typeof resultMin,
			`${string}!` & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.concat(sourceMax, suffix);

		type _CheckMaxResult = DCommon.ExpectType<
			typeof resultMax,
			`${string}!`,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.concat(sourceLength, suffix);

		type _CheckLengthResult = DCommon.ExpectType<
			typeof resultLength,
			`${string}!` & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
