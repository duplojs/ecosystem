import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("whenIsSelected", () => {
	it("should map selected information and keep unselected values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.whenIsSelected(
			input,
			{
				success: true,
				error: false,
			},
			(value) => {
				expect(value).toBe(42);
				return 84;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			84 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should map selected information in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.whenIsSelected(
				{
					success: false,
					error: true,
				},
				(value) => {
					expect(value).toBe("message");
					return "MESSAGE";
				},
			),
		);

		expect(result).toBe("MESSAGE");

		type _CheckResult = ExpectType<
			typeof result,
			"MESSAGE" | DEither.Success<42>,
			"strict"
		>;
	});

	it("should keep non either values unchanged", () => {
		const result = DEither.whenIsSelected(
			"plain",
			{} as never,
			(value) => value,
		);

		expect(result).toBe("plain");
	});

	it("should preserve decodeMap inference in a direct nested call", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.whenIsSelected(
			structure.decodeMap(codecs, "Jane"),
			{
				"map-success": true,
				"async-error": false,
				"map-error": false,
			},
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					string & DModeling.NewType<"user-name">,
					"strict"
				>;

				return "selected" as const;
			},
		);

		expect(result).toBe("selected");

		type _CheckResult = ExpectType<
			typeof result,
			| "selected"
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;
	});
});
