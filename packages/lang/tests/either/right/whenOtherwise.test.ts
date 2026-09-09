import { DEither, pipe, type ExpectType } from "@scripts";

describe("whenIsRightOtherwise", () => {
	it("should call the right callback for right values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(21)
				: DEither.error("message")
		);

		const result = DEither.whenIsRightOtherwise(
			input,
			(value) => {
				expect(value).toBe(21);
				return 42;
			},
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					DEither.Error<"message">,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call the otherwise callback for non right values in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
			input,
			DEither.whenIsRightOtherwise(
				(value) => value,
				(value) => DEither.unwrapLeft(value),
			),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			"message",
			"strict"
		>;
	});
});
