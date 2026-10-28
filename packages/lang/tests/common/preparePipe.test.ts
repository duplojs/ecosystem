
import * as DCommon from "@scripts/common";

describe("preparePipe", () => {
	it("creates a pipe function for a fixed input type", () => {
		const createPipe = DCommon.preparePipe<string>();
		const result = createPipe(
			(input) => input.length,
			(input) => input + 1,
			(input) => `${input}`,
		)("value");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`${number}`,
			"strict"
		>;

		expect(result).toBe("6");
	});
});
