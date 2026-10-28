import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";

describe("whenIsSelectedOtherwise", () => {
	it("should call the selected callback and type the otherwise value", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.whenIsSelectedOtherwise(
			input,
			{
				success: true,
				error: false,
			},
			(value) => {
				expect(value).toBe(42);
				return 84;
			},
			(value) => {
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					DEither.Error<"message">,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			84 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call otherwise for unselected information in pipe", () => {
		const input = DEither.error("message");
		const result = DCommon.pipe(
			input,
			DEither.whenIsSelectedOtherwise(
				{
					error: false,
				},
				(value) => value,
				(value) => DEither.unwrapLeft(value),
			),
		);

		expect(result).toBe("message");
	});

	it("should preserve decodeMap inference in a direct nested call", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.whenIsSelectedOtherwise(
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
			(value) => {
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					| DEither.Left<"async-error", DDataStructure.ErrorPromise>
					| DEither.Left<"map-error", DDataStructure.Error>,
					"strict"
				>;

				return "otherwise" as const;
			},
		);

		expect(result).toBe("selected");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"selected" | "otherwise",
			"strict"
		>;
	});
});
