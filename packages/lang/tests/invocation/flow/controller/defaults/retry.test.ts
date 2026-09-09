import { DEither, DInvocation, type ExpectType } from "@scripts";

describe("retry", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should retry previous flow steps while they return a left", async() => {
		let attemptCount = 0;
		const useFlow = DInvocation.flow(
			() => {
				attemptCount++;

				return attemptCount < 3
					? DEither.left("temporary")
					: DEither.result("created", attemptCount);
			},
			DInvocation.retry({ times: 3 }),
		);
		const result = await useFlow(undefined);

		expect(attemptCount).toBe(3);
		expect(result).toStrictEqual(DEither.result("created", 3));

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Left<"temporary", undefined>
			| DEither.Result<"created", number>,
			"strict"
		>;
	});

	it("should wait between retry attempts when timeout is configured", async() => {
		vi.useFakeTimers();

		let attemptCount = 0;
		const useFlow = DInvocation.flow(
			() => {
				attemptCount++;

				return attemptCount < 2
					? DEither.left("temporary")
					: DEither.result("created", attemptCount);
			},
			DInvocation.retry({
				times: 2,
				timeout: "10ms",
			}),
		);
		const result = useFlow(undefined);

		await Promise.resolve();
		expect(attemptCount).toBe(1);

		await vi.advanceTimersByTimeAsync(9);
		expect(attemptCount).toBe(1);

		await vi.advanceTimersByTimeAsync(1);
		await expect(result).resolves.toStrictEqual(DEither.result("created", 2));
		expect(attemptCount).toBe(2);
	});

	it("should retry without an explicit limit by default", async() => {
		let attemptCount = 0;
		const useFlow = DInvocation.flow(
			() => {
				attemptCount++;

				return attemptCount < 2
					? DEither.left("temporary")
					: DEither.result("created", attemptCount);
			},
			DInvocation.retry({}),
		);
		const result = await useFlow(undefined);

		expect(result).toStrictEqual(DEither.result("created", 2));
		expect(attemptCount).toBe(2);
	});
});
