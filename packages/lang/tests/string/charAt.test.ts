import { type DNumber, DString, pipe, type ExpectType } from "@scripts";

describe("charAt", () => {
	it("should return the character at index", () => {
		const result = DString.charAt("hello", 1);

		expect(result).toBe("e");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MaxCharacters<1>,
			"strict"
		>;
	});

	it("should return the character at index in pipe", () => {
		const result = pipe(
			"hello",
			DString.charAt(4),
		);

		expect(result).toBe("o");
	});

	it("should return an empty string when the index is out of range", () => {
		expect(DString.charAt("hello", 9)).toBe("");
	});

	it("should require a positive integer index", () => {
		const index = 1 as number & DNumber.StrictPositive;

		// @ts-expect-error index requires both positive and integer guarantees.
		DString.charAt("hello", index);
	});

	it("should preserve allowed characters", () => {
		const sourceAllowed = "hello" as string & DString.AllowedCharacters<"a-z">;
		const resultAllowed = DString.charAt(sourceAllowed, 1);

		type _CheckAllowedResult = ExpectType<
			typeof resultAllowed,
			string & DString.MaxCharacters<1> & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
