import * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";
import * as DString from "@scripts/string";

describe("otherwise", () => {
	it("treat normal value result", () => {
		const result = DPattern.otherwise(
			1 as 1 | DPattern.PatternResult<"match">,
			(value) => {
				type check = DCommon.ExpectType<
					typeof value,
					1,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(1);

		type Check = DCommon.ExpectType<
			typeof result,
			1 | "match",
			"strict"
		>;
	});

	it("not match on when", () => {
		const result = DCommon.pipe(
			"test" as "titi" | "test",
			DPattern.when(
				DCommon.equal("titi"),
				() => 50,
			),
			DPattern.otherwise(
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						"test",
						"strict"
					>;

					return DString.toUpperCase(value);
				},
			),
		);

		expect(result).toStrictEqual("TEST");

		type check = DCommon.ExpectType<
			typeof result,
			"TEST" | 50,
			"strict"
		>;
	});

	it("match on when and skip ", () => {
		const result = DCommon.pipe(
			"test" as "titi" | "test",
			DPattern.when(
				DCommon.equal("test"),
				() => 50,
			),
			DPattern.otherwise(DString.toUpperCase),
		);

		expect(result).toStrictEqual(50);

		type check = DCommon.ExpectType<
			typeof result,
			"TITI" | 50,
			"strict"
		>;
	});
});
