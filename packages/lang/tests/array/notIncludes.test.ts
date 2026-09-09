import { DArray, pipe } from "@scripts";

describe("notIncludes", () => {
	it("should validate missing value", () => {
		expect(DArray.notIncludes(["draft", "published"], "archived")).toBe(true);
		expect(DArray.notIncludes(["draft", "published"], "draft")).toBe(false);
	});

	it("should validate missing value in pipe", () => {
		const result = pipe(
			["draft", "published"] as const,
			DArray.notIncludes("draft"),
		);

		expect(result).toBe(false);
	});

	it("should only accept values from the array element type", () => {
		const source = ["draft", "published"] as const;

		if (false) {
			// @ts-expect-error "archived" is not part of the array values.
			DArray.notIncludes(source, "archived");
		}
	});
});
