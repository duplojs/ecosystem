import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";

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

		type _CheckResult = DCommon.ExpectType<
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

		const result = DCommon.pipe(
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

		type _CheckResult = DCommon.ExpectType<
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
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					string & DModeling.NewType<"user-name">,
					"strict"
				>;

				return "selected" as const;
			},
		);

		expect(result).toBe("selected");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| "selected"
			| DEither.Left<"async-error", DDataStructure.ErrorPromise>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;
	});
});
