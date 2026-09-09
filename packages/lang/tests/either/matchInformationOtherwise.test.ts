import { DEither, pipe, type ExpectType } from "@scripts";

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
				type _CheckValue = ExpectType<
					typeof value,
					DEither.Error<"message">,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			number | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call otherwise for an unmatched either in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
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
});
