import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

describe("findAndSpliceReplace", () => {
	it("should replace values at the first match without mutating the source", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.findAndSpliceReplace(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element === "bb" && params.index === 1;
			},
			["B"] as const,
		);

		expect(result).toEqual(["a", "B", "ccc"]);
		expect(source).toEqual(["a", "bb", "ccc"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			("a" | "bb" | "ccc" | "B")[] | undefined,
			"strict"
		>;
	});

	it("should replace values at the first match in pipe", () => {
		const result = DCommon.pipe(
			["a", "bb", "ccc"] as const,
			DArray.findAndSpliceReplace((value) => value === "bb", ["B"] as const),
		);

		expect(result).toEqual(["a", "B", "ccc"]);
	});

	it("should return undefined when no value matches", () => {
		expect(
			DArray.findAndSpliceReplace(["a"], (value) => value === "bb", ["B"]),
		).toBeUndefined();
	});
});
