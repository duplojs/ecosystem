import { DArray, pipe, type ExpectType } from "@scripts";

describe("findLast", () => {
	it("should find the last matching value with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.findLast(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toBe("ccc");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "bb" | "ccc" | undefined,
			"strict"
		>;
	});

	it("should find the last matching value in pipe", () => {
		const result = pipe(
			[1, 2, 3, 4] as const,
			DArray.findLast((value) => value > 2),
		);

		expect(result).toBe(4);
	});

	it("should narrow found value with a type predicate", () => {
		const result = DArray.findLast(
			["a", 1, "b", 2] as const,
			(value): value is "a" | "b" => typeof value === "string",
		);

		expect(result).toBe("b");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return undefined when no value matches", () => {
		expect(DArray.findLast([1, 2], (value) => value > 3)).toBeUndefined();
	});
});
