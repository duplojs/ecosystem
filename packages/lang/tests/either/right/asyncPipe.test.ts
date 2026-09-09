import { DEither, type ExpectType } from "@scripts";

describe("rightAsyncPipe", () => {
	it("should pipe awaited right values and wrap the final plain output into success", async() => {
		const result = DEither.rightAsyncPipe(
			Promise.resolve(DEither.right("start", 20)),
			(value) => {
				expect(value).toBe(20);
				const next = 21;
				return Promise.resolve(next);
			},
			(value) => {
				expect(value).toBe(21);
				const output = 42;
				return Promise.resolve(output);
			},
		);

		await expect(result).resolves.toStrictEqual(DEither.success(42));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<DEither.Success<number>>,
			"strict"
		>;
	});

	it("should pass plain awaited inputs through the pipe", async() => {
		const result = DEither.rightAsyncPipe(
			Promise.resolve(20),
			(value) => {
				expect(value).toBe(20);
				return 21;
			},
		);

		await expect(result).resolves.toStrictEqual(DEither.success(21));
	});

	it("should preserve right outputs and unwrap them for the next pipe", async() => {
		const result = DEither.rightAsyncPipe(
			DEither.success(20),
			(value) => {
				expect(value).toBe(20);
				return Promise.resolve(DEither.right("middle", 21));
			},
			(value) => {
				expect(value).toBe(21);
				return 42;
			},
		);

		await expect(result).resolves.toStrictEqual(DEither.success(42));
	});

	it("should keep the final right output unchanged", async() => {
		const output = DEither.right("final", 42);
		const result = DEither.rightAsyncPipe(
			DEither.success(20),
			(value) => {
				expect(value).toBe(20);
				return Promise.resolve(output);
			},
		);

		await expect(result).resolves.toBe(output);
	});

	it("should stop on initial or produced left values", async() => {
		const initial = DEither.error("initial");
		const produced = DEither.error("produced");
		const spy = vi.fn((value: number) => value);

		const first = DEither.rightAsyncPipe(
			Promise.resolve(initial),
			spy,
		);
		const second = DEither.rightAsyncPipe(
			DEither.success(42),
			() => Promise.resolve(produced),
			spy,
		);

		await expect(first).resolves.toBe(initial);
		await expect(second).resolves.toBe(produced);
		expect(spy).not.toHaveBeenCalled();
	});
});
