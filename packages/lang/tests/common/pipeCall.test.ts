
import * as DCommon from "@scripts/common";

describe("pipeCall", () => {
	it("wraps a callback for pipe usage", () => {
		const result = DCommon.pipe(
			"42" as const,
			DCommon.pipeCall((input: "42") => Number(input)),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(42);
	});
});
