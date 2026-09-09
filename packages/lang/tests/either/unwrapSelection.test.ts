import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("unwrapSelection", () => {
	it("should unwrap selected information and keep unselected values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.unwrapSelection(
			input,
			{
				success: true,
				error: false,
			},
		);

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42 | DEither.Error<"message">,
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
			DEither.unwrapSelection({
				success: false,
				error: true,
			}),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			"message" | DEither.Success<42>,
			"strict"
		>;
	});

	it("should keep unselected either values unchanged", () => {
		const input = DEither.error("message");
		const result = DEither.unwrapSelection(input, {
			error: false,
		});

		expect(result).toBe(input);
	});

	it("should keep non either values unchanged", () => {
		const result = DEither.unwrapSelection("plain", {} as never);

		expect(result).toBe("plain");
	});

	it("should preserve decodeMap inference in a direct nested call", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.unwrapSelection(
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
			| (string & DModeling.NewType<"user-name">)
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;
	});
});
