import { DEither, pipe, type ExpectType, when } from "@scripts";

describe("isSelected", () => {
	it("should identify selected either values and narrow direct inputs", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		if (DEither.isSelected(input, {
			success: true,
			error: false,
		})) {
			type _CheckInput = ExpectType<
				typeof input,
				DEither.Success<42>,
				"strict"
			>;

			expect(DEither.unwrapRight(input)).toBe(42);
		} else {
			type _CheckInput = ExpectType<
				typeof input,
				DEither.Error<"message">,
				"strict"
			>;
		}

		expect(DEither.isSelected(input, {
			success: true,
			error: false,
		})).toBe(true);
		const error = DEither.error("message");
		expect(DEither.isSelected(error, {
			error: false,
		})).toBe(false);
		expect(DEither.isSelected("plain", {} as never)).toBe(false);
	});

	it("should preserve narrowing in a pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = pipe(
			input,
			when(
				DEither.isSelected({
					success: true,
					error: false,
				}),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						DEither.Success<42>,
						"strict"
					>;

					return 84 as const;
				},
			),
		);

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			84 | DEither.Error<"message">,
			"strict"
		>;

		const exactResult: 84 | DEither.Error<"message"> = result;
		expect(exactResult).toBe(result);
	});

	it("should require every either information in direct and curried forms", () => {
		const input = DEither.success(42) as DEither.Success<42> | DEither.Error<"message">;

		// @ts-expect-error selector must handle every either information
		DEither.isSelected(input, { success: true });
		// @ts-expect-error selector cannot contain information outside the input
		DEither.isSelected(input, {
			success: true,
			error: false,
			other: false,
		});
		pipe(
			input,
			// @ts-expect-error selector must handle every either information
			DEither.isSelected({
				success: true,
			}),
		);

		expect(input).toBeDefined();
	});
});
