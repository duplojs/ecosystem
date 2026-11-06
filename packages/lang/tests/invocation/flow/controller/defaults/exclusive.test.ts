import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("exclusive", () => {
	it("rejects overlapping calls until the last step finishes when placed first", async() => {
		const pending = DCommon.createExternalPromise<number>();
		const execute = vi.fn((input: number) => input + 1);
		const finish = vi.fn((input: number) => pending.promise);
		const controller = DInvocation.exclusive<number>();
		const useFlow = DInvocation.flow(controller, execute, finish);
		const firstResult = useFlow(1);
		const rejectedResult = useFlow(2);

		expect(firstResult).toBeInstanceOf(Promise);
		expect(rejectedResult).toBeInstanceOf(Promise);
		expect(DInvocation.flowControllerKind.has(controller)).toBe(true);
		expect(DInvocation.flowControllerExclusiveKind.has(controller)).toBe(true);
		expect(DEither.hasInformation(await rejectedResult, "exclusive-reject")).toBe(true);
		expect(DEither.hasInformation(await useFlow(3), "exclusive-reject")).toBe(true);
		expect(execute).toHaveBeenCalledTimes(1);
		expect(finish).toHaveBeenCalledExactlyOnceWith(2, 1);

		pending.resolve(42);
		await expect(firstResult).resolves.toBe(42);
		await expect(useFlow(4)).resolves.toBe(42);
		expect(execute).toHaveBeenCalledTimes(2);

		type _CheckResult = DCommon.ExpectType<
			typeof firstResult,
			Promise<number | DEither.Left<"exclusive-reject">>,
			"strict"
		>;
	});

	it("rejects a duplicate before executing previous steps when placed last", async() => {
		const pending = DCommon.createExternalPromise<number>();
		const execute = vi.fn((input: number) => pending.promise);
		const useFlow = DInvocation.flow(execute, DInvocation.exclusive());
		const firstResult = useFlow(1);
		const rejectedResult = useFlow(2);

		expect(firstResult).toBeInstanceOf(Promise);
		expect(rejectedResult).toBeInstanceOf(Promise);
		expect(DEither.hasInformation(await rejectedResult, "exclusive-reject")).toBe(true);
		expect(execute).toHaveBeenCalledExactlyOnceWith(1, 1);
		pending.resolve(42);
		await expect(firstResult).resolves.toBe(42);
		await expect(useFlow(3)).resolves.toBe(42);
		expect(execute).toHaveBeenCalledTimes(2);
	});

	it("executes synchronous steps immediately and rejects reentrant calls with a promise", async() => {
		let reenter = () => {};
		const rejected = vi.fn<(result: Promise<number | DEither.Left<"exclusive-reject">>) => void>();
		const execute = vi.fn((input: number) => {
			reenter();
			return input + 1;
		});
		const useFlow = DInvocation.flow(DInvocation.exclusive<number>(), execute);
		reenter = () => {
			rejected(useFlow(0));
		};
		const result = useFlow(1);
		const nextResult = useFlow(2);

		expect(result).toBeInstanceOf(Promise);
		expect(execute).toHaveBeenCalledTimes(2);
		expect(rejected).toHaveBeenCalledTimes(2);
		for (const [rejectedResult] of rejected.mock.calls) {
			expect(rejectedResult).toBeInstanceOf(Promise);
			expect(DEither.hasInformation(await rejectedResult, "exclusive-reject")).toBe(true);
		}
		await expect(result).resolves.toBe(2);
		await expect(nextResult).resolves.toBe(3);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number | DEither.Left<"exclusive-reject">>,
			"strict"
		>;
	});

	it("releases the lock after a synchronous exception", async() => {
		const error = new Error("sync failure");
		const execute = vi.fn((input: number) => {
			if (input === 0) {
				throw error;
			}
			return input;
		});
		const useFlow = DInvocation.flow(execute, DInvocation.exclusive());

		await expect(useFlow(0)).rejects.toBe(error);
		await expect(useFlow(1)).resolves.toBe(1);
	});

	it("releases the lock after an asynchronous rejection", async() => {
		const pending = DCommon.createExternalPromise<number>();
		const error = new Error("async failure");
		const useFlow = DInvocation.flow(
			DInvocation.exclusive<number>(),
			(input) => input === 0 ? pending.promise : Promise.resolve(input),
		);
		const firstResult = useFlow(0);

		expect(DEither.hasInformation(await useFlow(1), "exclusive-reject")).toBe(true);
		pending.reject(error);
		await expect(firstResult).rejects.toBe(error);
		await expect(useFlow(2)).resolves.toBe(2);
	});

	it("preserves early exits and releases the lock", async() => {
		const useFlow = DInvocation.flow(
			DInvocation.exclusive<number>(),
			DInvocation.filter((input) => DEither.left("stopped", input)),
		);

		expect(DEither.unwrapByInformationOrThrow(await useFlow(1), "stopped")).toBe(1);
		expect(DEither.unwrapByInformationOrThrow(await useFlow(2), "stopped")).toBe(2);
	});

	it("preserves an existing exit from previous steps", async() => {
		const useFlow = DInvocation.flow(
			DInvocation.filter((input: number) => DEither.left("stopped", input)),
			DInvocation.exclusive(),
		);

		expect(DEither.unwrapByInformationOrThrow(await useFlow(1), "stopped")).toBe(1);
		expect(DEither.unwrapByInformationOrThrow(await useFlow(2), "stopped")).toBe(2);
	});

	it("keeps controller instances independent", async() => {
		const pending = DCommon.createExternalPromise<number>();
		const firstFlow = DInvocation.flow(DInvocation.exclusive<number>(), () => pending.promise);
		const secondFlow = DInvocation.flow(DInvocation.exclusive<number>(), (input) => input + 1);
		const firstResult = firstFlow(1);

		await expect(secondFlow(1)).resolves.toBe(2);
		pending.resolve(42);
		await expect(firstResult).resolves.toBe(42);
	});

	it("shares the lock when the same controller is used by multiple flows", async() => {
		const pending = DCommon.createExternalPromise<number>();
		const controller = DInvocation.exclusive<number>();
		const firstFlow = DInvocation.flow(controller, () => pending.promise);
		const secondFlow = DInvocation.flow(controller, (input) => input + 1);
		const firstResult = firstFlow(1);

		const rejectedResult = secondFlow(1);
		expect(rejectedResult).toBeInstanceOf(Promise);
		expect(DEither.hasInformation(await rejectedResult, "exclusive-reject")).toBe(true);
		pending.resolve(42);
		await expect(firstResult).resolves.toBe(42);
		await expect(secondFlow(1)).resolves.toBe(2);
	});
});
