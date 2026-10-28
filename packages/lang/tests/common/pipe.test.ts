
import * as DCommon from "@scripts/common";

describe("pipe", () => {
	it("runs every pipe in order", () => {
		const result = DCommon.pipe(
			"value" as const,
			(input) => input.length,
			(input) => input + 1,
			(input) => `${input}`,
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`${number}`,
			"strict"
		>;

		expect(result).toBe("6");
	});
});
