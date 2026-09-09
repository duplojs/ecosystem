import { DEither, pipe, type ExpectType } from "@scripts";

describe("rewriteInformation", () => {
	it("should rewrite a specialized right as a pure right", () => {
		const value = { id: 1 };
		const input = (
			Math.random() > -1
				? DEither.success(value)
				: DEither.error("message")
		);
		const result = DEither.rewriteInformation(input, {
			success: "loaded",
		});

		expect(result).toStrictEqual(DEither.right("loaded", value));
		expect(DEither.unwrapRight(result)).toBe(value);
		expect(DEither.successKind.has(result)).toBe(false);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<"loaded", { id: number }>
			| DEither.Error<"message">,
			"strict"
		>;
	});

	it("should rewrite a specialized left as a pure left", () => {
		const result = DEither.rewriteInformation(
			DEither.error("message"),
			{ error: "failure" },
		);

		expect(result).toStrictEqual(DEither.left("failure", "message"));
		expect(DEither.errorKind.has(result)).toBe(false);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Left<"failure", "message">,
			"strict"
		>;
	});

	it("should rewrite information in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);
		const result = pipe(
			input,
			DEither.rewriteInformation({
				error: "failure",
				success: "loaded",
			}),
		);

		expect(result).toStrictEqual(DEither.left("failure", "message"));

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Left<"failure", "message">
			| DEither.Right<"loaded", 42>,
			"strict"
		>;
	});

	it("should preserve unmatched either and plain values", () => {
		const input = DEither.success(42);
		const result = DEither.rewriteInformation(input, {});
		const plainResult = DEither.rewriteInformation("plain", {});

		expect(result).toBe(input);
		expect(plainResult).toBe("plain");

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
		type _CheckPlainResult = ExpectType<
			typeof plainResult,
			"plain",
			"strict"
		>;
	});

	it("should reject unavailable information keys", () => {
		if (false) {
			DEither.rewriteInformation(DEither.success(42), {
				// @ts-expect-error error is not available on the input.
				error: "failure",
			});
		}
	});
});
