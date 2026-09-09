import { DEither, pipe, type ExpectType } from "@scripts";

describe("whenIsRight", () => {
	it("should map right values and keep left or plain inputs unchanged", () => {
		const input = (
			Math.random() > -1
				? DEither.success(21)
				: DEither.error("message")
		);

		const result = DEither.whenIsRight(
			input,
			(value) => {
				expect(value).toBe(21);
				return 42;
			},
		);

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should map right values in pipe", () => {
		const result = pipe(
			DEither.right("value", "data"),
			DEither.whenIsRight((value) => {
				expect(value).toBe("data");
				return "DATA";
			}),
		);

		expect(result).toBe("DATA");

		type _CheckResult = ExpectType<
			typeof result,
			"DATA",
			"strict"
		>;
	});

	it("should keep non right input in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
			input,
			DEither.whenIsRight((value) => value),
		);

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Error<"message">,
			"strict"
		>;
	});
});
