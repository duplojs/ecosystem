import { DCommon, type ExpectType, pipe } from "@scripts";

describe("when", () => {
	it("runs the callback when the predicate accepts the input", () => {
		const input = "value" as string | number | null;
		const result = DCommon.when(
			input,
			(value): value is string => typeof value === "string",
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					string,
					"strict"
				>;

				return value.length;
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			number | null,
			"strict"
		>;

		expect(result).toBe(5);
	});

	it("returns the input when the predicate rejects it", () => {
		const input = 42 as string | number | null;
		const result = DCommon.when(
			input,
			(value): value is string => typeof value === "string",
			(value) => value.length,
		);

		type _CheckResult = ExpectType<
			typeof result,
			number | null,
			"strict"
		>;

		expect(result).toBe(42);
	});

	it("supports curried usage in a pipe", () => {
		const result = pipe(
			"value" as string | number,
			DCommon.when(
				(input): input is string => typeof input === "string",
				(input) => input.length,
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(5);
	});
});
