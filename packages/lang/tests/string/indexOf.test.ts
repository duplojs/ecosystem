import { DString, pipe, type ExpectType } from "@scripts";

describe("indexOf", () => {
	it("should return the first matching index", () => {
		const result = DString.indexOf("hello hello", "hello");

		expect(result).toBe(0);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should return the first matching index in pipe", () => {
		const result = pipe(
			"hello hello",
			DString.indexOf("hello"),
		);

		expect(result).toBe(0);
	});

	it("should start from a position", () => {
		expect(DString.indexOf("hello hello", "hello", 1)).toBe(6);
	});

	it("should return undefined when no value matches", () => {
		expect(DString.indexOf("hello", "world")).toBeUndefined();
	});
});
