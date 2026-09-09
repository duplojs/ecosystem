import { DDataStructure, type ExpectType } from "@scripts";

describe("unwrapLazy", () => {
	it("returns a non-lazy structure unchanged", () => {
		const structure = DDataStructure.string();
		const result = DDataStructure.unwrapLazy(structure);

		type _CheckResult = ExpectType<
			typeof result,
			DDataStructure.Structure<string>,
			"strict"
		>;

		expect(result).toBe(structure);
	});

	it("returns the memoized structure contained in a lazy structure", () => {
		const innerStructure = DDataStructure.string();
		const getStructure = vi.fn(() => innerStructure);
		const structure = DDataStructure.lazy(getStructure);
		const firstResult = DDataStructure.unwrapLazy(structure);
		const secondResult = DDataStructure.unwrapLazy(structure);

		type _CheckResult = ExpectType<
			typeof firstResult,
			DDataStructure.Structure<string>,
			"strict"
		>;

		expect(firstResult).toBe(innerStructure);
		expect(secondResult).toBe(innerStructure);
		expect(getStructure).toHaveBeenCalledTimes(1);
	});
});
