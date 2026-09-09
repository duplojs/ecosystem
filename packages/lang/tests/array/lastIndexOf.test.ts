import { DArray, pipe, type ExpectType } from "@scripts";

describe("lastIndexOf", () => {
	it("should return the last matching index", () => {
		const result = DArray.lastIndexOf(["a", "b", "a"] as const, "a");

		expect(result).toBe(2);

		type _CheckResult = ExpectType<
			typeof result,
			number | undefined,
			"strict"
		>;
	});

	it("should return the last matching index in pipe", () => {
		const result = pipe(
			["a", "b", "a"] as const,
			DArray.lastIndexOf("a"),
		);

		expect(result).toBe(2);
	});

	it("should start from a positive index", () => {
		expect(DArray.lastIndexOf(["a", "b", "a"], "a", 1)).toBe(0);
	});

	it("should start from a negative index relative to the end", () => {
		expect(DArray.lastIndexOf(["a", "b", "a"], "a", -2)).toBe(0);
	});

	it("should clamp out of range from indexes", () => {
		expect(DArray.lastIndexOf(["a", "b"], "a", -4)).toBe(0);
		expect(DArray.lastIndexOf(["a", "b"], "a", 4)).toBe(0);
	});

	it("should return undefined when no value matches", () => {
		expect(DArray.lastIndexOf(["a", "b"], "c")).toBeUndefined();
	});

	it("should only accept values from the array element type", () => {
		const source = ["draft", "published"] as const;

		if (false) {
			// @ts-expect-error "archived" is not part of the array values.
			DArray.lastIndexOf(source, "archived");
		}
	});
});
