import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("whenHasInformationOtherwise", () => {
	it("should map matching information and type the otherwise value", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.whenHasInformationOtherwise(
			input,
			"success",
			(value) => {
				expect(value).toBe(42);
				return 84;
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
			84 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call otherwise when information does not match in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
			input,
			DEither.whenHasInformationOtherwise(
				"success" as never,
				(value) => value,
				(value) => DEither.unwrapLeft(value),
			),
		);

		expect(result).toBe("message");
	});

	it("should map matching information from an array", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);
		const result = DEither.whenHasInformationOtherwise(
			input,
			["success", "error"],
			(value) => `${value}`,
			(value) => value,
		);

		expect(result).toBe("message");
	});

	it("should preserve inference for a directly nested decodeMap result", () => {
		const structure = DModeling.NewTypeStructure(
			"nested-number",
			DDataStructure.number(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.whenHasInformationOtherwise(
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
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					| DEither.Left<"async-error", undefined>
					| DEither.Left<"map-error", DDataStructure.Error>,
					"strict"
				>;

				return "otherwise" as const;
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			"mapped" | "otherwise",
			"strict"
		>;

		expect(result).toBe("mapped");
	});
});
