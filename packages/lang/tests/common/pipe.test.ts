import { DCommon, type ExpectType } from "@scripts";

describe("pipe", () => {
	it("runs every pipe in order", () => {
		const result = DCommon.pipe(
			"value" as const,
			(input) => input.length,
			(input) => input + 1,
			(input) => `${input}`,
		);

		type _CheckResult = ExpectType<
			typeof result,
			`${number}`,
			"strict"
		>;

		expect(result).toBe("6");
	});
});
