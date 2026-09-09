import { DCommon, type ExpectType, pipe } from "@scripts";

describe("innerPipe", () => {
	it("creates a pipe function", () => {
		const result = pipe(
			"value" as const,
			DCommon.innerPipe(
				(input) => input.length,
				(input) => input + 1,
				(input) => `${input}`,
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			`${number}`,
			"strict"
		>;

		expect(result).toBe("6");
	});
});
