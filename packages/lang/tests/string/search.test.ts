import { DString, pipe, type ExpectType } from "@scripts";

describe("search", () => {
	it("should return the matching index", () => {
		const result = DString.search("hello world", "world");

		expect(result).toBe(6);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should return the matching regex index", () => {
		expect(DString.search("item-42", /\d+/)).toBe(5);
	});

	it("should search in pipe", () => {
		const result = pipe(
			"hello world",
			DString.search(/world/),
		);

		expect(result).toBe(6);
	});

	it("should return undefined when pattern does not match", () => {
		expect(DString.search("hello", /world/)).toBeUndefined();
	});
});
