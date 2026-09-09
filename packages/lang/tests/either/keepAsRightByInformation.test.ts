import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("keepAsRightByInformation", () => {
	it("should convert selected left values to right values", () => {
		const input = DEither.left("selected", "value");
		const result = DEither.keepAsRightByInformation(input, "selected");

		expect(result).toStrictEqual(DEither.right("selected", "value"));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Right<"selected", "value">,
			"strict"
		>;
	});

	it("should convert unselected right values to left values", () => {
		const input = DEither.right("other", 42);
		const result = DEither.keepAsRightByInformation(input, "selected" as never);

		expect(result).toStrictEqual(DEither.left("other", 42));
	});

	it("should keep selected right values and non either values unchanged in pipe", () => {
		const input = DEither.success(42);
		const result = pipe(
			input,
			DEither.keepAsRightByInformation(["success"]),
		);
		const plain = DEither.keepAsRightByInformation("plain", "success" as never);

		expect(result).toBe(input);
		expect(plain).toBe("plain");

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
	});

	it("should preserve inference for a directly nested decodeMap result", () => {
		const structure = DModeling.NewTypeStructure(
			"nested-number",
			DDataStructure.number(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.keepAsRightByInformation(
			structure.decodeMap(codecs, 42),
			"map-success",
		);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				number & DModeling.NewType<"nested-number">
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(DEither.right("map-success", 42));
	});
});
