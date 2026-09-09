import { DString, pipe, type ExpectType } from "@scripts";

describe("sortCompare", () => {
	it("should compare strings with numeric collation", () => {
		const result = DString.sortCompare("item-2", "item-10");

		expect(result).toBeLessThan(0);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should compare strings in pipe", () => {
		const result = pipe(
			"item-10",
			DString.sortCompare("item-2"),
		);

		expect(result).toBeGreaterThan(0);
	});
});
