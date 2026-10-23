import * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import * as DPattern from "@scripts/pattern";

describe("matchWithNumber", () => {
	it("should call the matching handler with the narrowed number in classic form", () => {
		const input = 2 as 1 | 2;
		const result = DPattern.matchWithNumber(input, {
			1: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					1,
					"strict"
				>;

				return 42 as const;
			},
			2: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					2,
					"strict"
				>;

				return "failed" as const;
			},
		});

		expect(result).toBe("failed");

		type check = DCommon.ExpectType<
			typeof result,
			42 | "failed",
			"strict"
		>;
	});

	it("should work in pipe with the curried form", () => {
		const input = 1 as 1 | 2;
		const result = DCommon.pipe(
			input,
			DPattern.matchWithNumber({
				1: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						1,
						"strict"
					>;

					return 42 as const;
				},
				2: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						2,
						"strict"
					>;

					return "failed" as const;
				},
			}),
		);

		expect(result).toBe(42);

		type check = DCommon.ExpectType<
			typeof result,
			42 | "failed",
			"strict"
		>;
	});

	it("should support constrained number unions in classic and curried forms", () => {
		const input = 1 as (1 | 2) & DNumber.Positive;
		const classicResult = DPattern.matchWithNumber(input, {
			1: (value) => {
				type check = DCommon.ExpectType<typeof value, 1, "strict">;
				return value;
			},
			2: (value) => {
				type check = DCommon.ExpectType<typeof value, 2, "strict">;
				return value;
			},
		});
		const curriedResult = DCommon.pipe(
			input,
			DPattern.matchWithNumber({
				1: (value) => {
					type check = DCommon.ExpectType<typeof value, 1, "strict">;
					return value;
				},
				2: (value) => {
					type check = DCommon.ExpectType<typeof value, 2, "strict">;
					return value;
				},
			}),
		);

		expect(classicResult).toBe(1);
		expect(curriedResult).toBe(1);
		type classicCheck = DCommon.ExpectType<typeof classicResult, 1 | 2, "strict">;
		type curriedCheck = DCommon.ExpectType<typeof curriedResult, 1 | 2, "strict">;
	});

	it("should reject non-literal numbers in classic and curried forms", () => {
		const input = 1 as number;

		// @ts-expect-error input must be a number literal union
		DPattern.matchWithNumber(input, {
			1: () => 42,
		});

		DCommon.pipe(
			// @ts-expect-error curried matcher only accepts its number literal keys
			input,
			DPattern.matchWithNumber({
				1: () => 42,
			}),
		);

		expect(true).toBe(true);
	});

	it("should reject matchers with missing or additional keys", () => {
		const input = 1 as 1 | 2;

		// @ts-expect-error matcher must handle every input literal
		DPattern.matchWithNumber(input, {
			1: () => 42,
		});

		// @ts-expect-error matcher cannot declare keys outside the input union
		DPattern.matchWithNumber(input, {
			1: () => 42,
			2: () => "failed",
			3: () => false,
		});

		DCommon.pipe(
			input,
			// @ts-expect-error curried matcher must handle every piped input literal
			DPattern.matchWithNumber({
				1: () => 42,
			}),
		);
		DCommon.pipe(
			input,
			DPattern.matchWithNumber(
				// @ts-expect-error curried matcher cannot declare keys outside its input union
				{
					1: () => 42,
					2: () => "failed",
					3: () => false,
				},
			),
		);

		expect(true).toBe(true);
	});
});
