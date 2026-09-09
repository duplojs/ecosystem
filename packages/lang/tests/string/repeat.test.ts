import { type DNumber, DString, pipe, type ExpectType } from "@scripts";

describe("repeat", () => {
	it("should repeat a string", () => {
		const result = DString.repeat("ha", 3);

		expect(result).toBe("hahaha");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should repeat a string in pipe", () => {
		const result = pipe(
			"ha",
			DString.repeat(2),
		);

		expect(result).toBe("haha");
	});

	it("should return an empty string for invalid counts", () => {
		expect(DString.repeat("ha", -1 as never)).toBe("");
		expect(DString.repeat("ha", Number.POSITIVE_INFINITY as never)).toBe("");
	});

	it("should require a positive integer count", () => {
		const count = 1 as number & DNumber.StrictPositive;

		// @ts-expect-error count requires both positive and integer guarantees.
		DString.repeat("ha", count);
	});

	it("should preserve allowed characters", () => {
		const sourceAllowed = "abc" as string & DString.AllowedCharacters<"a-z">;
		const resultAllowed = DString.repeat(sourceAllowed, 2);

		type _CheckAllowedResult = ExpectType<
			typeof resultAllowed,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
	});
});
