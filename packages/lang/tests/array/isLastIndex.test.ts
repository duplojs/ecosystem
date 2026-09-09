import { DArray, pipe } from "@scripts";

describe("isLastIndex", () => {
	it("should validate the last index", () => {
		expect(DArray.isLastIndex(["a", "b"], 1)).toBe(true);
		expect(DArray.isLastIndex(["a", "b"], 0)).toBe(false);
	});

	it("should validate the last index in pipe", () => {
		const result = pipe(
			["a", "b"] as const,
			DArray.isLastIndex(1),
		);

		expect(result).toBe(true);
	});
});
