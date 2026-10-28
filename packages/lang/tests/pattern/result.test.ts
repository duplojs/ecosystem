import type * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";
import * as DKind from "@scripts/kind";

describe("Pattern result", () => {
	it("stores value with pattern result kind", () => {
		const input = "test" as const;
		const patternResult = DPattern.result(input);

		expect(patternResult).toStrictEqual({
			[`${DKind.keyKindPrefix}@DuplojsLangPattern/result`]: input,
		});

		type check = DCommon.ExpectType<
			typeof patternResult,
			DPattern.PatternResult<typeof input>,
			"strict"
		>;
	});

	it("identifies pattern results via type guard", () => {
		const sample = { foo: 42 } as const;
		const patternResult = DPattern.result(sample);
		const notPattern = { value: sample };

		expect(DPattern.isResult(patternResult)).toBe(true);
		expect(DPattern.isResult(notPattern)).toBe(false);

		const unionPattern: DPattern.PatternResult<typeof sample> | typeof notPattern = patternResult;

		if (DPattern.isResult(unionPattern)) {
			type check = DCommon.ExpectType<
				typeof unionPattern,
				DPattern.PatternResult<typeof sample>,
				"strict"
			>;
		}

		const unionNotPattern: DPattern.PatternResult<typeof sample> | typeof notPattern = notPattern;

		if (!DPattern.isResult(unionNotPattern)) {
			type check = DCommon.ExpectType<
				typeof unionNotPattern,
				typeof notPattern,
				"strict"
			>;
		}
	});
});
