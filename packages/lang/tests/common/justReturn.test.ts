import { DCommon, type ExpectType, pipe } from "@scripts";

describe("justReturn", () => {
	it("returns the provided value in direct form", () => {
		const result = DCommon.justReturn("input", 42 as const);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;

		expect(result).toBe(42);
	});

	it("returns the provided value in a pipe", () => {
		const result = pipe(
			"input",
			DCommon.justReturn(42 as const),
		);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;

		expect(result).toBe(42);
	});
});
