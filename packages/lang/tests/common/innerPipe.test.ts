
import * as DCommon from "@scripts/common";

describe("innerPipe", () => {
	it("creates a pipe function", () => {
		const result = DCommon.pipe(
			"value" as const,
			DCommon.innerPipe(
				(input) => input.length,
				(input) => input + 1,
				(input) => `${input}`,
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`${number}`,
			"strict"
		>;

		expect(result).toBe("6");
	});
});
