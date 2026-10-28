import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("isNullable", () => {
	it("returns true for a null structure", () => {
		const result = DDataStructure.isNullable(
			DDataStructure.null(),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});

	it("returns true for a union that accepts null", () => {
		const structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.null(),
		]);

		expect(structure.is(null)).toBe(true);
		expect(DDataStructure.isNullable(structure)).toBe(true);
	});

	it("returns true for a lazy structure that accepts null", () => {
		const structure = DDataStructure.lazy(
			() => DDataStructure.nullable(DDataStructure.string()),
		);

		expect(structure.is(null)).toBe(true);
		expect(DDataStructure.isNullable(structure)).toBe(true);
	});

	it("returns false for structures that reject null", () => {
		const structures = [
			DDataStructure.string(),
			DDataStructure.optional(DDataStructure.string()),
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.undefined(),
			]),
		] as const;

		for (const structure of structures) {
			expect(structure.is(null)).toBe(false);
			expect(DDataStructure.isNullable(structure)).toBe(false);
		}
	});
});
