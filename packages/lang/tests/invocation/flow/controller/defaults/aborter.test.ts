import { DCommon, DEither, DInvocation, type ExpectType } from "@scripts";

describe("aborter", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should provide an abort controller and continue the flow", async() => {
		const abortControllers: AbortController[] = [];
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter((input, abortController) => {
				type _CheckInput = ExpectType<
					typeof input,
					string,
					"strict"
				>;
				type _CheckAbortController = ExpectType<
					typeof abortController,
					AbortController,
					"strict"
				>;

				abortControllers.push(abortController);

				return `accepted-${input}` as `accepted-${string}`;
			}),
		);
		const result = useFlow("first");

		await expect(result).resolves.toBe("accepted-first");
		expect(abortControllers).toHaveLength(1);
		expect(abortControllers[0]!.signal.aborted).toBe(false);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| `accepted-${string}`
				| DEither.Left<"signal-aborted", DInvocation.AbortErrorFlowController>
			>,
			"strict"
		>;
	});

	it("should abort the previous execution when the flow is called again", async() => {
		const abortControllers: AbortController[] = [];
		const firstPendingResult = DCommon.createExternalPromise<`accepted-${string}`>();
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter((input, abortController) => {
				abortControllers.push(abortController);

				if (input === "first") {
					abortController.signal.addEventListener("abort", () => {
						firstPendingResult.reject(abortController.signal.reason);
					});

					return firstPendingResult.promise;
				}

				return Promise.resolve(`accepted-${input}` as `accepted-${string}`);
			}),
		);
		const firstResult = useFlow("first");
		const secondResult = useFlow("second");

		expect(abortControllers).toHaveLength(2);
		expect(abortControllers[0]!.signal.aborted).toBe(true);
		expect(abortControllers[0]!.signal.reason).toBeInstanceOf(DInvocation.AbortErrorFlowController);
		expect(abortControllers[1]!.signal.aborted).toBe(false);

		await expect(firstResult).resolves.toStrictEqual(
			DEither.left("signal-aborted", abortControllers[0]!.signal.reason),
		);
		await expect(secondResult).resolves.toBe("accepted-second");
	});

	it("should exit the flow when the current signal is aborted before completion", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter((input, abortController) => {
				abortController.abort(new DInvocation.AbortErrorFlowController(abortController));

				return `accepted-${input}`;
			}),
		);
		const result = useFlow("first");

		await expect(result).resolves.toStrictEqual(
			DEither.left("signal-aborted", expect.any(DInvocation.AbortErrorFlowController)),
		);
	});

	it("should exit the flow when the timeout aborts a pending execution", async() => {
		vi.useFakeTimers();

		const abortControllers: AbortController[] = [];
		const pendingResult = DCommon.createExternalPromise<`accepted-${string}`>();
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter((input, abortController) => {
				abortControllers.push(abortController);
				abortController.signal.addEventListener("abort", () => {
					pendingResult.reject(abortController.signal.reason);
				});

				return pendingResult.promise.then(
					() => `accepted-${input}` as `accepted-${string}`,
				);
			}, { timeout: "10ms" }),
		);
		const result = useFlow("first");

		expect(abortControllers).toHaveLength(1);
		expect(abortControllers[0]!.signal.aborted).toBe(false);

		await vi.advanceTimersByTimeAsync(9);
		expect(abortControllers[0]!.signal.aborted).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		expect(abortControllers[0]!.signal.aborted).toBe(true);
		expect(abortControllers[0]!.signal.reason).toBeInstanceOf(DInvocation.AbortErrorFlowController);

		await expect(result).resolves.toStrictEqual(
			DEither.left("signal-aborted", abortControllers[0]!.signal.reason),
		);
	});

	it("should keep the result when the execution completes before the timeout", async() => {
		vi.useFakeTimers();

		const abortControllers: AbortController[] = [];
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter((input, abortController) => {
				abortControllers.push(abortController);

				return Promise.resolve(`accepted-${input}` as `accepted-${string}`);
			}, { timeout: "10ms" }),
		);
		const result = useFlow("first");

		await expect(result).resolves.toBe("accepted-first");
		expect(abortControllers).toHaveLength(1);
		expect(abortControllers[0]!.signal.aborted).toBe(false);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| `accepted-${string}`
				| DEither.Left<"signal-aborted", DInvocation.AbortErrorFlowController>
			>,
			"strict"
		>;
	});

	it("should keep an existing flow exit", async() => {
		const stopFlowKind = DInvocation.createKind("test-aborter-stop-flow");
		const stopFlow = DInvocation.createFlowController(
			stopFlowKind,
			({ exitFlow, init }) => () => init(
				() => exitFlow(DEither.left("stopped")),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.aborter(() => "accepted"),
			() => "next",
		);
		const result = useFlow(undefined);

		await expect(result).resolves.toStrictEqual(DEither.left("stopped"));
	});

	it("should throw errors that are not abort errors", async() => {
		const error = new Error("failed");
		const useFlow = DInvocation.flow(
			(input: string) => input,
			DInvocation.aborter(() => {
				throw error;
			}),
		);
		const result = useFlow("first");

		await expect(result).rejects.toBe(error);
	});
});
