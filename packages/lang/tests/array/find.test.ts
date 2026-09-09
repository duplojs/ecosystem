import { DArray, pipe, type ExpectType } from "@scripts";

describe("find", () => {
	it("should find a value with callback params", () => {
		const source = ["a", "bb", "ccc"] as const;
		const result = DArray.find(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element.length === params.index + 1;
			},
		);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "bb" | "ccc" | undefined,
			"strict"
		>;
	});

	it("should find a value in pipe", () => {
		const result = pipe(
			[1, 2, 3, 4] as const,
			DArray.find((value) => value > 2),
		);

		expect(result).toBe(3);
	});

	it("should narrow found value with a type predicate", () => {
		const result = DArray.find(
			["a", 1, "b", 2] as const,
			(value): value is "a" | "b" => typeof value === "string",
		);

		expect(result).toBe("a");

		type _CheckResult = ExpectType<
			typeof result,
			"a" | "b" | undefined,
			"strict"
		>;
	});

	it("should return undefined when no value matches", () => {
		expect(DArray.find([1, 2], (value) => value > 3)).toBeUndefined();
	});
});
