import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

describe("includes", () => {
	it("should validate contained value", () => {
		expect(DArray.includes(["draft", "published"], "draft")).toBe(true);
		expect(DArray.includes(["draft", "published"], "archived")).toBe(false);
	});

	it("should validate contained value in pipe", () => {
		const result = DCommon.pipe(
			["draft", "published"] as const,
			DArray.includes("draft"),
		);

		expect(result).toBe(true);
	});

	it("should only accept values from the array element type", () => {
		const source = ["draft", "published"] as const;

		// @ts-expect-error "archived" is not part of the array values.
		expect(DArray.includes(source, "archived")).toBe(false);
	});
});
