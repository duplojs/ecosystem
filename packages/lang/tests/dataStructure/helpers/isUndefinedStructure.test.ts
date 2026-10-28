import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("isUndefinedStructure", () => {
	it("returns true for an undefined structure", () => {
		const result = DDataStructure.isUndefinedStructure(
			DDataStructure.undefined(),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});

	it("returns false for another type structure", () => {
		expect(
			DDataStructure.isUndefinedStructure(
				DDataStructure.string(),
			),
		).toBe(false);
	});

	it("returns false for a non-type structure", () => {
		expect(
			DDataStructure.isUndefinedStructure(
				DDataStructure.union([
					DDataStructure.undefined(),
					DDataStructure.string(),
				]),
			),
		).toBe(false);
	});
});
