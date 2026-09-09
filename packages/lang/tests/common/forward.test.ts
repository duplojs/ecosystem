import { DCommon, type ExpectType } from "@scripts";

describe("forward", () => {
	it("returns the input unchanged", () => {
		const input = { value: "test" } as const;
		const result = DCommon.forward(input);

		type _CheckResult = ExpectType<
			typeof result,
			typeof input,
			"strict"
		>;

		expect(result).toBe(input);
	});
});
