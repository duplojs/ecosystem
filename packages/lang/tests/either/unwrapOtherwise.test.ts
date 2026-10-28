import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("unwrapOtherwise", () => {
	it("should unwrap right values without calling otherwise", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);
		const otherwise = vi.fn(() => "fallback" as const);
		const result = DEither.unwrapOtherwise(input, otherwise);

		expect(result).toBe(42);
		expect(otherwise).not.toHaveBeenCalled();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			42 | "fallback",
			"strict"
		>;
	});

	it("should lazily return the fallback for left and plain values", () => {
		const leftOtherwise = vi.fn(() => "left fallback" as const);
		const plainOtherwise = vi.fn(() => "plain fallback" as const);

		const leftResult = DEither.unwrapOtherwise(
			DEither.error("message"),
			leftOtherwise,
		);
		const plainResult = DEither.unwrapOtherwise(
			"plain",
			plainOtherwise,
		);

		expect(leftResult).toBe("left fallback");
		expect(plainResult).toBe("plain fallback");
		expect(leftOtherwise).toHaveBeenCalledOnce();
		expect(plainOtherwise).toHaveBeenCalledOnce();

		type _CheckLeftResult = DCommon.ExpectType<
			typeof leftResult,
			"left fallback",
			"strict"
		>;
		type _CheckPlainResult = DCommon.ExpectType<
			typeof plainResult,
			"plain fallback",
			"strict"
		>;
	});

	it("should lazily unwrap or return the fallback in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);
		const otherwise = vi.fn(() => "fallback" as const);
		const result = DCommon.pipe(
			input,
			DEither.unwrapOtherwise(otherwise),
		);

		expect(result).toBe("fallback");
		expect(otherwise).toHaveBeenCalledOnce();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			42 | "fallback",
			"strict"
		>;
	});
});
