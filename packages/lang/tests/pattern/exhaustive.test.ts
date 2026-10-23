import type * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";

describe("exhaustive", () => {
	it("returns the wrapped value", () => {
		const sample = { foo: 42 } as const;
		const patternResult = DPattern.result(sample);

		const extracted = DPattern.exhaustive(patternResult);

		expect(extracted).toBe(sample);

		type check = DCommon.ExpectType<
			typeof extracted,
			typeof sample,
			"strict"
		>;
	});
});

