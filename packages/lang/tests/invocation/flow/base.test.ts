import { DInvocation, type ExpectType } from "@scripts";

describe("flow", () => {
	it("should execute simple pipes in sequence", () => {
		const useFlow = DInvocation.flow(
			(input: number) => input + 1,
			(input) => String(input),
			(input) => `value-${input}`,
		);
		const result = useFlow(41);

		expect(result).toBe("value-42");

		type _CheckResult = ExpectType<
			typeof result,
			`value-${string}`,
			"strict"
		>;
	});
});
