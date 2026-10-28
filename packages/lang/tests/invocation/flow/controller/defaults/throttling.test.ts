import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("throttling", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should reject executions started during the throttling window", async() => {
		vi.useFakeTimers();

		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.throttling("10ms"),
			(input) => `accepted-${input}`,
		);
		const firstResult = useFlow("first");

		await expect(firstResult).resolves.toBe("accepted-first");

		const secondResult = useFlow("second");
		const thirdResult = useFlow("third");

		await vi.advanceTimersByTimeAsync(10);
		await expect(secondResult).resolves.toStrictEqual(DEither.left("throttling-reject", undefined));
		await expect(thirdResult).resolves.toStrictEqual("accepted-third");

		type _CheckSecondResult = DCommon.ExpectType<
			typeof secondResult,
			Promise<
				| `accepted-${string}`
				| DEither.Left<"throttling-reject">
			>,
			"strict"
		>;
	});

	it("should keep an existing flow exit", async() => {
		vi.useFakeTimers();

		const stopFlowKind = DInvocation.createKind("test-throttling-stop-flow");
		const stopFlow = DInvocation.createFlowController(
			stopFlowKind,
			({ exitFlow, init }) => () => init(
				() => exitFlow(DEither.left("stopped", undefined)),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.throttling("10ms"),
			() => "accepted",
		);
		const result = useFlow(undefined);

		await expect(result).resolves.toStrictEqual(DEither.left("stopped", undefined));
	});
});
