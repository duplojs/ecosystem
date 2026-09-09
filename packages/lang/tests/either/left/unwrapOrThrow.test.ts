import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapLeftOrThrow", () => {
	it("should unwrap left values", () => {
		const result = DEither.unwrapLeftOrThrow(DEither.error("message"));

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			"message",
			"strict"
		>;
	});

	it("should throw when the input is not left", () => {
		const input = DEither.success(42);

		expect(() => DEither.unwrapLeftOrThrow(input)).toThrow(DEither.NotLeftError);

		try {
			DEither.unwrapLeftOrThrow(input);
		} catch (error) {
			expect(error).toBeInstanceOf(DEither.NotLeftError);

			if (error instanceof DEither.NotLeftError) {
				expect(error.message).toBe("Value is not Left.");
				expect(error.value).toBe(input);
			}
		}
	});

	it("should unwrap left values in pipe", () => {
		const result = pipe(
			DEither.left("value", "data"),
			DEither.unwrapLeftOrThrow,
		);

		expect(result).toBe("data");
	});
});
