import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("keepAsRightSelection", () => {
	it("should convert selected left values to right values", () => {
		const input = DEither.left("selected", "value");
		const result = DEither.keepAsRightSelection(input, {
			selected: true,
		});

		expect(result).toStrictEqual(DEither.right("selected", "value"));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Right<"selected", "value">,
			"strict"
		>;
	});

	it("should convert unselected right values to left values", () => {
		const input = DEither.right("other", 42);
		const result = DEither.keepAsRightSelection(input, {
			other: false,
		});

		expect(result).toStrictEqual(DEither.left("other", 42));
	});

	it("should keep unselected left values unchanged", () => {
		const input = DEither.error("message");
		const result = DEither.keepAsRightSelection(input, {
			error: false,
		});

		expect(result).toBe(input);
	});

	it("should keep selected right values and non either values unchanged in pipe", () => {
		const input = DEither.success(42);
		const result = pipe(
			input,
			DEither.keepAsRightSelection({
				success: true,
			}),
		);
		const plain = DEither.keepAsRightSelection("plain", {} as never);

		expect(result).toBe(input);
		expect(plain).toBe("plain");

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
	});

	it("should preserve decodeMap inference in a direct nested call", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.keepAsRightSelection(
			structure.decodeMap(codecs, "Jane"),
			{
				"map-success": true,
				"async-error": false,
				"map-error": false,
			},
		);

		expect(result).toStrictEqual(DEither.right("map-success", "Jane"));

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				string & DModeling.NewType<"user-name">
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;
	});
});
