import { DString, pipe, type ExpectType } from "@scripts";

describe("lastIndexOf", () => {
	it("should return the last matching index", () => {
		const result = DString.lastIndexOf("hello hello", "hello");

		expect(result).toBe(6);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should return the last matching index in pipe", () => {
		const result = pipe(
			"hello hello",
			DString.lastIndexOf("hello"),
		);

		expect(result).toBe(6);
	});

	it("should start from a position", () => {
		expect(DString.lastIndexOf("hello hello", "hello", 5)).toBe(0);
	});

	it("should return undefined when no value matches", () => {
		expect(DString.lastIndexOf("hello", "world")).toBeUndefined();
	});
});
