import { DArray, pipe, type ExpectType } from "@scripts";

describe("findAndSpliceDelete", () => {
	it("should delete values from the first match without mutating the source", () => {
		const source = ["a", "bb", "ccc"] as string[] & DArray.MaxElements<3>;
		const result = DArray.findAndSpliceDelete(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element === "bb" && params.index === 1;
			},
			1,
		);

		expect(result).toEqual(["a", "ccc"]);
		expect(source).toEqual(["a", "bb", "ccc"]);

		type _CheckResult = ExpectType<
			typeof result,
			(readonly string[] & DArray.MaxElements<3>) | undefined,
			"strict"
		>;
	});

	it("should delete values from the first match in pipe", () => {
		const result = pipe(
			["a", "bb", "ccc"] as const,
			DArray.findAndSpliceDelete((value) => value === "bb", 1),
		);

		expect(result).toEqual(["a", "ccc"]);
	});

	it("should return undefined when no value matches", () => {
		expect(
			DArray.findAndSpliceDelete(["a", "bb"], (value) => value === "ccc", 1),
		).toBeUndefined();
	});

	it("should distribute constrained array unions before deleting values from the first match", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.findAndSpliceDelete(source, (value) => value === 2, 1);

		expect(result).toEqual([1, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.MaxElements<0>)
			| (readonly number[] & DArray.MaxElements<3>)
			| undefined,
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMin = ["a", "bb", "ccc"] as string[] & DArray.MinElements<3>;
		const resultMin = DArray.findAndSpliceDelete(sourceMin, () => true, 1);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			readonly string[] | undefined,
			"strict"
		>;

		const sourceLength = ["a", "bb", "ccc"] as string[] & DArray.LengthEqual<3>;
		const resultLength = DArray.findAndSpliceDelete(sourceLength, () => true, 1);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			(readonly string[] & DArray.MaxElements<3>) | undefined,
			"strict"
		>;
	});
});
