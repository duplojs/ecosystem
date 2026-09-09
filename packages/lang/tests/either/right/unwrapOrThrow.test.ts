import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapRightOrThrow", () => {
	it("should unwrap right values", () => {
		const result = DEither.unwrapRightOrThrow(DEither.success(42));

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;
	});

	it("should throw when the input is not right", () => {
		const input = DEither.error("message");

		expect(() => DEither.unwrapRightOrThrow(input)).toThrow(DEither.NotRightError);

		try {
			DEither.unwrapRightOrThrow(input);
		} catch (error) {
			expect(error).toBeInstanceOf(DEither.NotRightError);

			if (error instanceof DEither.NotRightError) {
				expect(error.message).toBe("Value is not Right.");
				expect(error.value).toBe(input);
			}
		}
	});

	it("should unwrap right values in pipe", () => {
		const result = pipe(
			DEither.right("value", "data"),
			DEither.unwrapRightOrThrow,
		);

		expect(result).toBe("data");
	});
});
