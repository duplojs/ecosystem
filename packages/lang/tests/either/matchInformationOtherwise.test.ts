import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DString from "@scripts/string";

describe("matchInformationOtherwise", () => {
	it("should match provided information and call otherwise for the rest", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.matchInformationOtherwise(
			input,
			{
				success: () => 84,
			},
			(value) => {
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					DEither.Error<"message">,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call otherwise for an unmatched either in pipe", () => {
		const input = DEither.error("message");
		const result = DCommon.pipe(
			input,
			DEither.matchInformationOtherwise(
				{},
				(value) => DEither.unwrapLeft(value),
			),
		);

		expect(result).toBe("message");
	});

	it("should call otherwise for non either values", () => {
		const result = DEither.matchInformationOtherwise(
			"plain",
			{},
			(value) => {
				expect(value).toBe("plain");
				return "PLAIN";
			},
		);

		expect(result).toBe("PLAIN");
	});

	it("should infer the success value when every information is matched", () => {
		const input = (
			Math.random() > -1
				? DEither.left("negative-operand", -42)
				: DEither.success(42)
		);

		const result = DEither.matchInformationOtherwise(
			input,
			{
				"negative-operand": () => "un opérande est négatif" as const,
				success: (value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, 42, "strict">;

					return DString.to(value);
				},
			},
			() => "calcul impossible" as const,
		);

		expect(result).toBe("un opérande est négatif");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"un opérande est négatif" | "42" | "calcul impossible",
			"strict"
		>;
	});

	it("should reject undefined handlers in direct and curried forms", () => {
		const input = DEither.success(42);
		const result = DEither.matchInformationOtherwise(input, {}, () => "fallback" as const);

		if (false) {
			// @ts-expect-error matcher handlers cannot be undefined
			DEither.matchInformationOtherwise(input, { success: undefined }, () => 0);

			DCommon.pipe(
				input,
				// @ts-expect-error curried matcher handlers cannot be undefined
				DEither.matchInformationOtherwise({ success: undefined }, () => 0),
			);
		}

		expect(result).toBe("fallback");
	});

	it("should infer the success value in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.left("negative-operand", -42)
				: DEither.success(42)
		);

		const result = DCommon.pipe(
			input,
			DEither.matchInformationOtherwise(
				{
					"negative-operand": () => "un opérande est négatif" as const,
					success: (value) => {
						type _CheckValue = DCommon.ExpectType<typeof value, 42, "strict">;

						return DString.to(value);
					},
				},
				() => "calcul impossible" as const,
			),
		);

		expect(result).toBe("un opérande est négatif");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"un opérande est négatif" | "42" | "calcul impossible",
			"strict"
		>;
	});
});
