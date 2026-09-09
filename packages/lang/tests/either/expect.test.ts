import { DEither, type ExpectType } from "@scripts";

describe("expect", () => {
	it("should keep an either unchanged and preserve its exact type", () => {
		const input = DEither.success(42);
		const result = DEither.expect(input);

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;

		// @ts-expect-error input must be an either
		DEither.expect("plain");
	});
});
