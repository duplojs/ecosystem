import * as DInvocation from "@scripts/invocation";
import * as DEither from "@scripts/either";
import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";

describe("flow", () => {
	const hookControllerKind = DInvocation.createKind("test-flow-end-hook");
	const observeFlowEnd = DInvocation.createFlowController(
		hookControllerKind,
		({ init }) => <GenericInput extends unknown>(callback: () => void) => init<
			& DInvocation.FlowController<GenericInput, never>
			& DKind.Kind<typeof hookControllerKind>
		>(
			(previousFunction, { onFlowEnd }) => {
				onFlowEnd(callback);
				return previousFunction();
			},
		),
	);

	it("returns a promise while executing synchronous pipes immediately in sequence", async() => {
		const lastStep = vi.fn((input: string) => `value-${input}` as const);
		const useFlow = DInvocation.flow(
			(input: number) => input + 1,
			(input) => String(input),
			lastStep,
		);
		const result = useFlow(41);

		expect(result).toBeInstanceOf(Promise);
		expect(lastStep).toHaveBeenCalledExactlyOnceWith("42", 41);
		await expect(result).resolves.toBe("value-42");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<`value-${string}`>,
			"strict"
		>;
	});

	it("passes the original argument to each step and keeps calls independent", async() => {
		const observe = vi.fn((input: number, argument: { readonly value: number }) => input + argument.value);
		const useFlow = DInvocation.flow(
			(input: { readonly value: number }, argument) => {
				type _CheckArgument = DCommon.ExpectType<typeof argument, typeof input, "strict">;

				expect(argument).toBe(input);
				return input.value * 2;
			},
			observe,
			(input, argument) => {
				type _CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
				type _CheckArgument = DCommon.ExpectType<typeof argument, { readonly value: number }, "strict">;

				return input + argument.value;
			},
		);
		const first = { value: 3 } as const;
		const second = { value: 5 } as const;

		const firstResult = useFlow(first);
		const secondResult = useFlow(second);
		expect(observe).toHaveBeenNthCalledWith(1, 6, first);
		expect(observe).toHaveBeenNthCalledWith(2, 10, second);
		await expect(firstResult).resolves.toBe(12);
		await expect(secondResult).resolves.toBe(20);
	});

	it("preserves the original argument across async steps and controllers", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => Promise.resolve(input.length),
			DInvocation.filter((input) => DEither.success(input + 1)),
			(input, argument) => {
				type _CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
				type _CheckArgument = DCommon.ExpectType<typeof argument, string, "strict">;

				return `${argument}:${input}`;
			},
		);
		const result = useFlow("test");

		await expect(result).resolves.toBe("test:5");

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<`${string}:${number}`>, "strict">;
	});

	it("skips subsequent steps when a controller exits", async() => {
		const next = vi.fn((input: number, argument: string) => `${argument}:${input}`);
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => input > 4 ? DEither.success(input) : DEither.error(input)),
			next,
		);

		const rejected = useFlow("test");
		expect(rejected).toBeInstanceOf(Promise);
		expect(next).not.toHaveBeenCalled();
		expect(DEither.unwrapByInformationOrThrow(await rejected, "error")).toBe(4);
		const accepted = useFlow("longer");
		expect(next).toHaveBeenCalledExactlyOnceWith(6, "longer");
		await expect(accepted).resolves.toBe("longer:6");
	});

	it("runs all end hooks after the final synchronous step without retaining callbacks", async() => {
		const firstEnd = vi.fn();
		const secondEnd = vi.fn();
		const lastStep = vi.fn((input: number) => {
			expect(firstEnd).toHaveBeenCalledTimes(input - 1);
			expect(secondEnd).toHaveBeenCalledTimes(input - 1);
			return input;
		});
		const useFlow = DInvocation.flow(
			observeFlowEnd<number>(firstEnd),
			(input: number) => input,
			observeFlowEnd(secondEnd),
			lastStep,
		);

		const firstResult = useFlow(1);
		expect(firstEnd).toHaveBeenCalledTimes(1);
		expect(secondEnd).toHaveBeenCalledTimes(1);
		const secondResult = useFlow(2);
		expect(firstEnd).toHaveBeenCalledTimes(2);
		expect(secondEnd).toHaveBeenCalledTimes(2);
		await expect(firstResult).resolves.toBe(1);
		await expect(secondResult).resolves.toBe(2);
	});

	it("keeps end hooks independent for overlapping asynchronous calls", async() => {
		const first = DCommon.createExternalPromise<number>();
		const second = DCommon.createExternalPromise<number>();
		const onEnd = vi.fn();
		const useFlow = DInvocation.flow(
			(input: DCommon.ExternalPromise<number>) => input.promise,
			observeFlowEnd(onEnd),
		);
		const firstResult = useFlow(first);
		const secondResult = useFlow(second);

		expect(onEnd).not.toHaveBeenCalled();
		second.resolve(2);
		await expect(secondResult).resolves.toBe(2);
		expect(onEnd).toHaveBeenCalledTimes(1);
		first.resolve(1);
		await expect(firstResult).resolves.toBe(1);
		expect(onEnd).toHaveBeenCalledTimes(2);
	});

	it("runs end hooks on an early exit", async() => {
		const onEnd = vi.fn();
		const useFlow = DInvocation.flow(
			(input: number) => input,
			observeFlowEnd(onEnd),
			DInvocation.filter(() => DEither.left("stopped", undefined)),
		);

		const result = useFlow(1);
		expect(onEnd).toHaveBeenCalledTimes(1);
		expect(DEither.hasInformation(await result, "stopped")).toBe(true);
	});

	it("runs end hooks and rejects with a synchronous exception", async() => {
		const error = new Error("sync failure");
		const onEnd = vi.fn();
		const useFlow = DInvocation.flow(
			observeFlowEnd(onEnd),
			() => {
				throw error;
			},
		);

		const result = useFlow(undefined);
		expect(result).toBeInstanceOf(Promise);
		expect(onEnd).toHaveBeenCalledTimes(1);
		await expect(result).rejects.toBe(error);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<never>, "strict">;
	});

	it("rejects when an end hook throws during failure cleanup", async() => {
		const error = new Error("cleanup failure");
		const onEnd = vi.fn(() => {
			throw error;
		});
		const useFlow = DInvocation.flow(
			observeFlowEnd(onEnd),
			() => {
				throw new Error("execution failure");
			},
		);
		const result = useFlow(undefined);

		expect(result).toBeInstanceOf(Promise);
		expect(onEnd).toHaveBeenCalledTimes(1);
		await expect(result).rejects.toBe(error);
	});

	it("runs end hooks and preserves a rejected promise", async() => {
		const error = new Error("async failure");
		const onEnd = vi.fn();
		const useFlow = DInvocation.flow(
			observeFlowEnd(onEnd),
			() => Promise.reject(error),
		);

		await expect(useFlow(undefined)).rejects.toBe(error);
		expect(onEnd).toHaveBeenCalledTimes(1);
	});
});
