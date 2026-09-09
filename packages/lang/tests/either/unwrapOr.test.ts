import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapOr", () => {
	it("should unwrap right values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);
		const result = DEither.unwrapOr(input, "fallback");

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42 | "fallback",
			"strict"
		>;
	});

	it("should return the fallback for left and plain values", () => {
		const leftResult = DEither.unwrapOr(
			DEither.error("message"),
			"fallback",
		);
		const plainResult = DEither.unwrapOr("plain", "fallback");

		expect(leftResult).toBe("fallback");
		expect(plainResult).toBe("fallback");

		type _CheckLeftResult = ExpectType<
			typeof leftResult,
			"fallback",
			"strict"
		>;
		type _CheckPlainResult = ExpectType<
			typeof plainResult,
			"fallback",
			"strict"
		>;
	});

	it("should unwrap or return the fallback in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);
		const result = pipe(
			input,
			DEither.unwrapOr("fallback"),
		);

		expect(result).toBe("fallback");

		type _CheckResult = ExpectType<
			typeof result,
			42 | "fallback",
			"strict"
		>;
	});
});
