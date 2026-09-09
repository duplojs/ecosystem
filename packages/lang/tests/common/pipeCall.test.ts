import { DCommon, type ExpectType, pipe } from "@scripts";

describe("pipeCall", () => {
	it("wraps a callback for pipe usage", () => {
		const result = pipe(
			"42" as const,
			DCommon.pipeCall((input: "42") => Number(input)),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(42);
	});
});
