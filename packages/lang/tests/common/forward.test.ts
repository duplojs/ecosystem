
import * as DCommon from "@scripts/common";

describe("forward", () => {
	it("returns the input unchanged", () => {
		const input = { value: "test" } as const;
		const result = DCommon.forward(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			typeof input,
			"strict"
		>;

		expect(result).toBe(input);
	});
});
