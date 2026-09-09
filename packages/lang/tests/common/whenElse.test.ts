import { DCommon, type ExpectType, pipe } from "@scripts";

describe("whenElse", () => {
	it("runs the then branch when the predicate accepts the input", () => {
		const input = "value" as string | number | null;
		const result = DCommon.whenElse(
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
			number | string,
			"strict"
		>;

		expect(result).toBe(5);
	});

	it("runs the else branch when the predicate rejects the input", () => {
		const input = 42 as string | number | null;
		const result = DCommon.whenElse(
			input,
			(value): value is string => typeof value === "string",
			(value) => value.length,
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
			number | string,
			"strict"
		>;

		expect(result).toBe("42.00");
	});

	it("supports curried usage in a pipe", () => {
		const result = pipe(
			"value" as string | number,
			DCommon.whenElse(
				(input): input is string => typeof input === "string",
				(input) => input.length,
				(input) => input.toFixed(2),
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;

		expect(result).toBe(5);
	});
});
