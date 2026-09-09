import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("unwrapSelectionOrThrow", () => {
	it("should unwrap selected information", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.unwrapSelectionOrThrow(
			input,
			{
				success: true,
				error: false,
			},
		);

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;
	});

	it("should unwrap selected information in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.unwrapSelectionOrThrow({
				success: false,
				error: true,
			}),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			"message",
			"strict"
		>;
	});

	it("should throw when information is not selected", () => {
		const input = DEither.error("message");
		const selector = { error: false };

		expect(() => DEither.unwrapSelectionOrThrow(input, selector))
			.toThrow(DEither.HasNotSelectedInformationError);

		try {
			DEither.unwrapSelectionOrThrow(input, selector);
		} catch (error) {
			expect(error).toBeInstanceOf(DEither.HasNotSelectedInformationError);

			if (error instanceof DEither.HasNotSelectedInformationError) {
				expect(error.message).toBe("Value information is not selected.");
				expect(error.value).toBe(input);
				expect(error.selector).toBe(selector);
			}
		}
	});

	it("should preserve decodeMap inference in a direct nested call", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.unwrapSelectionOrThrow(
			structure.decodeMap(codecs, "Jane"),
			{
				"map-success": true,
				"async-error": false,
				"map-error": false,
			},
		);

		expect(result).toBe("Jane");

		type _CheckResult = ExpectType<
			typeof result,
			string & DModeling.NewType<"user-name">,
			"strict"
		>;
	});
});
