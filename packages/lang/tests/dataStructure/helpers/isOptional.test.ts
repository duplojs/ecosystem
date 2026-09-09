import { DDataStructure, type ExpectType } from "@scripts";

describe("isOptional", () => {
	it("returns true for an undefined structure", () => {
		const result = DDataStructure.isOptional(
			DDataStructure.undefined(),
		);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});

	it("returns true for a union that accepts undefined", () => {
		const structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.undefined(),
		]);

		expect(structure.is(undefined)).toBe(true);
		expect(DDataStructure.isOptional(structure)).toBe(true);
	});

	it("returns true for a lazy structure that accepts undefined", () => {
		const structure = DDataStructure.lazy(
			() => DDataStructure.optional(DDataStructure.string()),
		);

		expect(structure.is(undefined)).toBe(true);
		expect(DDataStructure.isOptional(structure)).toBe(true);
	});

	it("returns false for structures that reject undefined", () => {
		const structures = [
			DDataStructure.string(),
			DDataStructure.nullable(DDataStructure.string()),
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.null(),
			]),
		] as const;

		for (const structure of structures) {
			expect(structure.is(undefined)).toBe(false);
			expect(DDataStructure.isOptional(structure)).toBe(false);
		}
	});
});
