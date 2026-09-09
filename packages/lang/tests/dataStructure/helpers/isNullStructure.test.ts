import { DDataStructure, type ExpectType } from "@scripts";

describe("isNullStructure", () => {
	it("returns true for a null structure", () => {
		const result = DDataStructure.isNullStructure(
			DDataStructure.null(),
		);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});

	it("returns false for another type structure", () => {
		expect(
			DDataStructure.isNullStructure(
				DDataStructure.string(),
			),
		).toBe(false);
	});

	it("returns false for a non-type structure", () => {
		expect(
			DDataStructure.isNullStructure(
				DDataStructure.union([
					DDataStructure.null(),
					DDataStructure.string(),
				]),
			),
		).toBe(false);
	});
});
