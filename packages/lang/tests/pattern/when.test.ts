import * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";

describe("pattern when", () => {
	it("match", () => {
		const result = DPattern.when(
			"duplojs" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toStrictEqual(DPattern.result("duplojs"));

		type check = DCommon.ExpectType<
			typeof result,
			"laravel" | DPattern.PatternResult<"duplojs">,
			"strict"
		>;
	});

	it("match", () => {
		const result = DPattern.when(
			"laravel" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toBe("laravel");

		type check = DCommon.ExpectType<
			typeof result,
			"laravel" | DPattern.PatternResult<"duplojs">,
			"strict"
		>;
	});

	it("wraps matched input into pattern result", () => {
		const result = DCommon.pipe(
			"duplojs" as "duplojs" | "laravel",
			DPattern.when(
				(value) => value === "duplojs",
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"duplojs",
						"strict"
					>;

					return {
						framework: value,
						matched: true as const,
					};
				},
			),
			DPattern.when(
				DCommon.equal("laravel"),
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"laravel",
						"strict"
					>;

					return {
						framework: value,
						matched: true as const,
					};
				},
			),
			DPattern.exhaustive,
		);

		expect(result).toStrictEqual({
			framework: "duplojs",
			matched: true,
		});

		type check = DCommon.ExpectType<
			typeof result,
			{
				framework: "duplojs";
				matched: true;
			} | {
				framework: "laravel";
				matched: true;
			},
			"strict"
		>;
	});

	it("transform unknown input in AnyValue", () => {
		const result = DPattern.match("test" as unknown)
			.when(
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						DCommon.AnyValue,
						"strict"
					>;

					return DCommon.equal(value, "test");
				},
				(value) => value,
			)
			.otherwise((value) => value);

		expect(result).toStrictEqual("test");
	});
});
