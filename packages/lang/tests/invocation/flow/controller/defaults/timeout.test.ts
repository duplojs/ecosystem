import { DInvocation, type ExpectType } from "@scripts";

describe("timeout", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should delay the next flow step", async() => {
		vi.useFakeTimers();

		const steps: string[] = [];
		const useFlow = DInvocation.flow(
			(input: number) => {
				steps.push("before-timeout");
				return input + 1;
			},
			DInvocation.timeout("10ms"),
			(input) => {
				steps.push("after-timeout");
				return input * 2;
			},
		);
		const result = useFlow(20);

		await Promise.resolve();
		expect(steps).toStrictEqual(["before-timeout"]);

		await vi.advanceTimersByTimeAsync(9);
		expect(steps).toStrictEqual(["before-timeout"]);

		await vi.advanceTimersByTimeAsync(1);
		await expect(result).resolves.toBe(42);
		expect(steps).toStrictEqual(["before-timeout", "after-timeout"]);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;
	});

	it("should keep an existing flow exit without waiting", async() => {
		vi.useFakeTimers();

		const stopFlowKind = DInvocation.createKind("test-timeout-stop-flow");
		const stopFlow = DInvocation.createFlowController(
			stopFlowKind,
			({ exitFlow, init }) => () => init(
				() => exitFlow("stopped"),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.timeout("10ms"),
			() => "accepted",
		);
		const result = useFlow(undefined);

		await expect(result).resolves.toBe("stopped");
	});
});
