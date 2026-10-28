import * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";

describe("pattern whenNot", () => {
	it("match", () => {
		const result = DPattern.whenNot(
			"laravel" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toStrictEqual(DPattern.result("laravel"));

		type check = DCommon.ExpectType<
			typeof result,
			"duplojs" | DPattern.PatternResult<"laravel">,
			"strict"
		>;
	});

	it("match", () => {
		const result = DPattern.whenNot(
			"duplojs" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toBe("duplojs");

		type check = DCommon.ExpectType<
			typeof result,
			"duplojs" | DPattern.PatternResult<"laravel">,
			"strict"
		>;
	});

	it("wraps unmatched input into pattern result", () => {
		const result = DCommon.pipe(
			"duplojs" as "duplojs" | "laravel",
			DPattern.whenNot(
				(value) => value === "duplojs",
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"laravel",
						"strict"
					>;

					return {
						framework: value,
						matched: false as const,
					};
				},
			),
			DPattern.when(
				DCommon.equal("duplojs"),
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"duplojs",
						"strict"
					>;

					return {
						framework: value,
						matched: false as const,
					};
				},
			),
			DPattern.exhaustive,
		);

		expect(result).toStrictEqual({
			framework: "duplojs",
			matched: false,
		});

		type check = DCommon.ExpectType<
			typeof result,
			{
				framework: "duplojs";
				matched: false;
			} | {
				framework: "laravel";
				matched: false;
			},
			"strict"
		>;
	});
});
