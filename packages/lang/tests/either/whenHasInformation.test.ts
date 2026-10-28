import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";

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

		type _CheckResult = DCommon.ExpectType<
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

		const result = DCommon.pipe(
			input,
			DEither.whenHasInformation(
				["success", "error"],
				(value) => `${value}`,
			),
		);

		expect(result).toBe("message");

		type _CheckResult = DCommon.ExpectType<
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
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					number & DModeling.NewType<"nested-number">,
					"strict"
				>;

				return "mapped" as const;
			},
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| "mapped"
			| DEither.Left<"async-error", DDataStructure.ErrorPromise>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toBe("mapped");
	});
});
