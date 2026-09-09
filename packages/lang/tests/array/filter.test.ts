import { DArray, pipe, type ExpectType } from "@scripts";

describe("filter", () => {
	it("should filter values with callback params", () => {
		const source = ["a", "bb", "ccc"] as string[] & DArray.MaxElements<3>;
		const result = DArray.filter(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toEqual(["a", "bb", "ccc"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly string[] & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should filter values in pipe", () => {
		const result = pipe(
			[1, 2, 3, 4],
			DArray.filter((value) => value % 2 === 0),
		);

		expect(result).toEqual([2, 4]);
	});

	it("should narrow filtered values with a type predicate", () => {
		const result = DArray.filter(
			["a", 1, "b", 2] as const,
			(value): value is "a" | "b" => typeof value === "string",
		);

		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ("a" | "b")[] & DArray.MaxElements<4>,
			"strict"
		>;
	});

	it("should distribute constrained array unions before filtering", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.filter(source, () => true);

		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly number[] & DArray.MaxElements<0>)
			| (readonly number[] & DArray.MaxElements<3>),
			"strict"
		>;
	});

	it("should discard incompatible size constraints", () => {
		const sourceMin = ["a", "bb", "ccc"] as string[] & DArray.MinElements<3>;
		const resultMin = DArray.filter(sourceMin, () => true);

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			readonly string[],
			"strict"
		>;

		const sourceLength = ["a", "bb", "ccc"] as string[] & DArray.LengthEqual<3>;
		const resultLength = DArray.filter(sourceLength, () => true);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			readonly string[] & DArray.MaxElements<3>,
			"strict"
		>;
	});
});
