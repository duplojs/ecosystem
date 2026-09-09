import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("whenHasInformation", () => {
	it("should map values matching one information", () => {
		const input = (
			Math.random() > -1
				? DEither.right("created", 42)
				: DEither.error("message")
		);

		const result = DEither.whenHasInformation(
			input,
			"created",
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

	it("should map values matching multiple informations in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.whenHasInformation(
				["success", "error"],
				(value) => `${value}`,
			),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			`${42 | "message"}`,
			"strict"
		>;
	});

	it("should keep values when information does not match", () => {
		const input = DEither.error("message");
		const result = DEither.whenHasInformation(
			input,
			"success" as never,
			(value) => value,
		);

		expect(result).toBe(input);
	});

	it("should preserve inference for a directly nested decodeMap result", () => {
		const structure = DModeling.NewTypeStructure(
			"nested-number",
			DDataStructure.number(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.whenHasInformation(
			structure.decodeMap(codecs, 42),
			"map-success",
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					number & DModeling.NewType<"nested-number">,
					"strict"
				>;

				return "mapped" as const;
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			| "mapped"
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toBe("mapped");
	});
});
