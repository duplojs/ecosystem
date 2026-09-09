import { DCommon, type ExpectType, pipe } from "@scripts";

describe("whenNot", () => {
	it("runs the callback when the predicate rejects the input", () => {
		const input = 42 as string | number | null;
		const result = DCommon.whenNot(
			input,
			(value): value is string => typeof value === "string",
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					number | null,
					"strict"
				>;

				return value === null
					? "null"
					: value.toFixed(2);
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("42.00");
	});

	it("returns the input when the predicate accepts it", () => {
		const input = "value" as string | number | null;
		const result = DCommon.whenNot(
			input,
			(value): value is string => typeof value === "string",
			(value) => value === null
				? "null"
				: value.toFixed(2),
		);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("value");
	});

	it("supports curried usage in a pipe", () => {
		const result = pipe(
			42 as string | number,
			DCommon.whenNot(
				(input): input is string => typeof input === "string",
				(input) => input.toFixed(2),
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("42.00");
	});
});
