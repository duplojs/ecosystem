import { DArray, pipe, type ExpectType } from "@scripts";

describe("at", () => {
	it("should return a maybe element for tuple input", () => {
		const result = DArray.at(["a", "b", "c"] as const, 1);

		expect(result).toBe("b");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | "c",
			"strict"
		>;
	});

	it("should distribute array unions before returning the value at an index", () => {
		const source = ["a", "b"] as readonly ["a", "b"] | readonly [];
		const result = DArray.at(source, 0);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return the value at the index in pipe", () => {
		const result = pipe(
			["a", "b", "c"] as const,
			DArray.at(1),
		);

		expect(result).toBe("b");
	});

	it("should return a maybe element for tuple input with out of range index", () => {
		const result = DArray.at(["a" as const, "b" as const], 4);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return a maybe value for a wide array", () => {
		const result = DArray.at(["a", "b"], 4);

		type _CheckResult = ExpectType<
			typeof result,
			string | undefined,
			"strict"
		>;
	});

	it("should return the element type when the index is covered by constraints", () => {
		const source = ["a", "b"] as string[] & DArray.MinElements<2>;
		const result = DArray.at(source, 1);

		expect(result).toBe("b");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should return undefined when the index is out of range by constraints", () => {
		const source = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const result = DArray.at(source, 4);

		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});

	it("should use exact length constraints to decide if an index exists", () => {
		const source = ["a", "b"] as string[] & DArray.LengthEqual<2>;
		const coveredResult = DArray.at(source, 1);
		expect(coveredResult).toBe("b");

		type _CheckCoveredResult = ExpectType<
			typeof coveredResult,
			string,
			"strict"
		>;

		const outOfRangeResult = DArray.at(source, 2);
		expect(outOfRangeResult).toBeUndefined();

		type _CheckOutOfRangeResult = ExpectType<
			typeof outOfRangeResult,
			undefined,
			"strict"
		>;
	});
});
