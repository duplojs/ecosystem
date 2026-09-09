import { DCommon, type ExpectType } from "@scripts";

describe("asyncRetry", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("retries while the check function rejects the result", async() => {
		let attempt = 0;
		const result = DCommon.useAsyncRetry(
			() => Promise.resolve(++attempt),
			(output) => output < 3,
			{ maxRetry: 5 },
		);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;

		await expect(result).resolves.toBe(3);
		expect(attempt).toBe(3);
	});

	it("stops at max retry", async() => {
		let attempt = 0;
		const result = await DCommon.useAsyncRetry(
			() => Promise.resolve(++attempt),
			() => true,
			{ maxRetry: 2 },
		);

		expect(result).toBe(2);
		expect(attempt).toBe(2);
	});

	it("waits between retries when a sleep duration is configured", async() => {
		vi.useFakeTimers();

		let attempt = 0;
		const result = DCommon.useAsyncRetry(
			() => Promise.resolve(++attempt),
			(output) => output < 2,
			{
				maxRetry: 3,
				timeToSleep: 10,
			},
		);

		await Promise.resolve();
		expect(attempt).toBe(1);

		await vi.advanceTimersByTimeAsync(9);
		expect(attempt).toBe(1);

		await vi.advanceTimersByTimeAsync(1);
		await expect(result).resolves.toBe(2);
		expect(attempt).toBe(2);
	});

	it("creates a retry wrapper preserving arguments", async() => {
		let attempt = 0;
		const retry = DCommon.createAsyncRetry(
			(input: string, suffix: string) => {
				attempt++;

				return Promise.resolve(`${input}-${suffix}-${attempt}` as const);
			},
			(output) => output.endsWith("-1"),
			{ maxRetry: 3 },
		);

		const result = retry("value", "suffix");

		type _CheckResult = ExpectType<
			typeof result,
			Promise<`${string}-${string}-${number}`>,
			"strict"
		>;

		await expect(result).resolves.toBe("value-suffix-2");
	});
});
