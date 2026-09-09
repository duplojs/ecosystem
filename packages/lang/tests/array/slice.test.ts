import { DArray, pipe, type ExpectType } from "@scripts";

describe("slice", () => {
	it("should slice values", () => {
		const result = DArray.slice(["a", "b", "c"] as const, 1, 3);

		expect(result).toEqual(["b", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			("a" | "b" | "c")[],
			"strict"
		>;
	});

	it("should slice values in pipe", () => {
		const result = pipe(
			["a", "b", "c"] as const,
			DArray.slice(1, 2),
		);

		expect(result).toEqual(["b"]);
	});

	it("should slice all values without bounds", () => {
		const source = ["a", "b"] as const;
		const result = DArray.slice(source);

		expect(result).toEqual(["a", "b"]);
		expect(result).not.toBe(source);
	});
});
