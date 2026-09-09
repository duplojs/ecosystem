import { DCommon, type ExpectType } from "@scripts";

describe("timeout", () => {
	it("resolves after the requested delay", async() => {
		vi.useFakeTimers();

		const result = DCommon.timeout(10);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<void>,
			"strict"
		>;

		const onResolved = vi.fn();
		void result.then(onResolved);

		await vi.advanceTimersByTimeAsync(9);
		expect(onResolved).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(1);
		await expect(result).resolves.toBeUndefined();
		expect(onResolved).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});

	it("uses the default timer delay", async() => {
		vi.useFakeTimers();

		const result = DCommon.timeout();

		await vi.runAllTimersAsync();
		await expect(result).resolves.toBeUndefined();

		vi.useRealTimers();
	});
});
