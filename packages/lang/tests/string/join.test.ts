import { type DArray, DString, pipe, type ExpectType } from "@scripts";

describe("join", () => {
	it("should join a tuple with a separator", () => {
		const result = DString.join(["hello", "world"] as const, " ");

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should join strings in pipe", () => {
		const result = pipe(
			["a", "b", "c"] as const,
			DString.join("-"),
		);

		expect(result).toBe("a-b-c");

		type _CheckResult = ExpectType<
			typeof result,
			"a-b-c",
			"strict"
		>;
	});

	it("should handle an empty tuple", () => {
		const result = DString.join([] as const, ",");

		expect(result).toBe("");

		type _CheckResult = ExpectType<
			typeof result,
			"",
			"strict"
		>;
	});

	it("should return a large string for constrained arrays and strings", () => {
		const strings = ["a", "b"] as unknown as readonly (string & DString.MinCharacters<1>)[] & DArray.MinElements<2>;
		const separator = "-" as "-" & DString.LengthEqual<1>;
		const result = DString.join(strings, separator);

		expect(result).toBe("a-b");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
