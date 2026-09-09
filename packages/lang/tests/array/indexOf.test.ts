import { DArray, pipe, type ExpectType } from "@scripts";

describe("indexOf", () => {
	it("should return the first matching index", () => {
		const result = DArray.indexOf(["a", "b", "a"] as const, "a");

		expect(result).toBe(0);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should return the first matching index in pipe", () => {
		const result = pipe(
			["a", "b", "a"] as const,
			DArray.indexOf("a"),
		);

		expect(result).toBe(0);
	});

	it("should start from a positive index", () => {
		expect(DArray.indexOf(["a", "b", "a"], "a", 1)).toBe(2);
	});

	it("should start from a negative index relative to the end", () => {
		expect(DArray.indexOf(["a", "b", "a"], "a", -2)).toBe(2);
	});

	it("should return undefined when no value matches", () => {
		expect(DArray.indexOf(["a", "b"], "a", 4)).toBeUndefined();
	});

	it("should only accept values from the array element type", () => {
		const source = ["draft", "published"] as const;

		if (false) {
			// @ts-expect-error "archived" is not part of the array values.
			DArray.indexOf(source, "archived");
		}
	});
});
