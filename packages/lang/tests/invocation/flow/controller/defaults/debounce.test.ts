import { DEither, DInvocation, type ExpectType } from "@scripts";

describe("debounce", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should only let the last pending execution continue", async() => {
		vi.useFakeTimers();

		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.debounce("10ms"),
			(input) => `accepted-${input}`,
		);
		const firstResult = useFlow("first");
		const secondResult = useFlow("second");

		await expect(firstResult).resolves.toStrictEqual(DEither.left("debounce-reject"));

		await vi.advanceTimersByTimeAsync(10);
		await expect(secondResult).resolves.toBe("accepted-second");

		type _CheckFirstResult = ExpectType<
			typeof firstResult,
			Promise<
				| `accepted-${string}`
				| DEither.Left<"debounce-reject">
			>,
			"strict"
		>;
	});

	it("should keep an existing flow exit", async() => {
		vi.useFakeTimers();

		const stopFlowKind = DInvocation.createKind("test-debounce-stop-flow");
		const stopFlow = DInvocation.createFlowController(
			stopFlowKind,
			({ exitFlow, init }) => () => init(
				() => exitFlow(DEither.left("stopped")),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.debounce("10ms"),
			() => "accepted",
		);
		const result = useFlow(undefined);

		await expect(result).resolves.toStrictEqual(DEither.left("stopped"));
	});
});
