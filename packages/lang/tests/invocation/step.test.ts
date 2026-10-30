import type * as DCommon from "@scripts/common";
import * as DInvocation from "@scripts/invocation";

describe("createStep", () => {
	it("delegates an output before resuming the function that returned the step", () => {
		const output = { name: "Alice" } as const;
		const resume = vi.fn((id: string) => ({
			id,
			name: output.name,
		}));
		const prepareUser = () => DInvocation.createStep(output, resume);
		const step = prepareUser();

		expect(DInvocation.stepKind.has(step)).toBe(true);
		expect(resume).not.toHaveBeenCalled();

		type _CheckStep = DCommon.ExpectType<
			typeof step,
			DInvocation.Step<typeof output, typeof resume>,
			"strict"
		>;

		const saveUser = vi.fn((value: typeof output) => {
			expect(value).toBe(output);
			return "user-42";
		});
		const result = step.run((params) => {
			type _CheckParams = DCommon.ExpectType<
				typeof params,
				DInvocation.BeforeStepFunctionParams<typeof output, typeof resume>,
				"strict"
			>;

			expect(params.output).toBe(output);
			expect(params.nextFunction).toBe(resume);
			expect(resume).not.toHaveBeenCalled();

			return params.nextFunction(saveUser(params.output));
		});

		expect(saveUser).toHaveBeenCalledExactlyOnceWith(output);
		expect(resume).toHaveBeenCalledExactlyOnceWith("user-42");
		expect(saveUser).toHaveBeenCalledBefore(resume);
		expect(result).toStrictEqual({
			id: "user-42",
			name: "Alice",
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				id: string;
				name: "Alice";
			},
			"strict"
		>;
	});

	it("returns the handler result without automatically invoking the next function", () => {
		const nextFunction = vi.fn((): "continued" | "cancelled" => "continued");
		const step = DInvocation.createStep("pending", nextFunction);
		const beforeStep = vi.fn(() => "cancelled" as const);

		const result = step.run(beforeStep);

		expect(beforeStep).toHaveBeenCalledExactlyOnceWith({
			output: "pending",
			nextFunction,
		});
		expect(nextFunction).not.toHaveBeenCalled();
		expect(result).toBe("cancelled");

		type _CheckResult = DCommon.ExpectType<typeof result, "cancelled", "strict">;
	});

	it("allows asynchronous work before a synchronous continuation", async() => {
		const save = vi.fn((value: string) => Promise.resolve(value));
		const resume = vi.fn((id: string) => ({ id }));
		const step = DInvocation.createStep("user-42", resume);

		const result = step.run(async({ output, nextFunction }) => {
			const id = await save(output);
			return nextFunction(id);
		});

		expect(resume).not.toHaveBeenCalled();
		expect(await result).toStrictEqual({ id: "user-42" });
		expect(save).toHaveBeenCalledExactlyOnceWith("user-42");
		expect(resume).toHaveBeenCalledExactlyOnceWith("user-42");
		expect(save).toHaveBeenCalledBefore(resume);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<{ id: string }>, "strict">;
	});

	it("preserves the promise returned by an asynchronous continuation", async() => {
		const expected = { status: "completed" } as const;
		const promise = Promise.resolve(expected);
		const resume = vi.fn((enabled: boolean) => {
			expect(enabled).toBe(true);
			return promise;
		});
		const step = DInvocation.createStep(true, resume);

		const result = step.run(({ output, nextFunction }) => nextFunction(output));

		expect(result).toBe(promise);
		expect(await result).toBe(expected);
		expect(resume).toHaveBeenCalledExactlyOnceWith(true);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof expected>, "strict">;
	});

	it("allows the continuation to return another step before the final result", () => {
		const finish = vi.fn((id: string) => ({ id }));
		const continueWith = vi.fn((id: string) => DInvocation.createStep(id, finish));
		const step = DInvocation.createStep("user-42", continueWith);

		const nextStep = step.run(({ output, nextFunction }) => nextFunction(output));

		expect(continueWith).toHaveBeenCalledExactlyOnceWith("user-42");
		expect(finish).not.toHaveBeenCalled();
		expect(DInvocation.stepKind.has(nextStep)).toBe(true);

		type _CheckNextStep = DCommon.ExpectType<
			typeof nextStep,
			DInvocation.Step<string, typeof finish>,
			"strict"
		>;

		const result = nextStep.run(({ output, nextFunction }) => nextFunction(output));

		expect(finish).toHaveBeenCalledExactlyOnceWith("user-42");
		expect(result).toStrictEqual({ id: "user-42" });

		type _CheckResult = DCommon.ExpectType<typeof result, { id: string }, "strict">;
	});

	it("propagates an error thrown by the handler without resuming", () => {
		const resume = vi.fn(() => "completed" as const);
		const step = DInvocation.createStep("pending", resume);
		const error = new Error("delegated operation failed");
		const beforeStep = vi.fn(() => {
			throw error;
		});

		expect(() => step.run(beforeStep)).toThrow(error);
		expect(beforeStep).toHaveBeenCalledExactlyOnceWith({
			output: "pending",
			nextFunction: resume,
		});
		expect(resume).not.toHaveBeenCalled();
	});

	it("propagates an error thrown while resuming", () => {
		const error = new Error("continuation failed");
		const resume = vi.fn((): string => {
			throw error;
		});
		const step = DInvocation.createStep("pending", resume);

		expect(() => step.run(({ nextFunction }) => nextFunction())).toThrow(error);
		expect(resume).toHaveBeenCalledExactlyOnceWith();
	});

	it("preserves a rejected promise returned by the handler", async() => {
		const resume = vi.fn(() => "completed" as const);
		const step = DInvocation.createStep("pending", resume);
		const error = new Error("delegated operation failed");
		const promise = Promise.reject(error);

		const result = step.run(() => promise);

		expect(result).toBe(promise);
		await expect(result).rejects.toBe(error);
		expect(resume).not.toHaveBeenCalled();
	});

	it("requires a handler result compatible with the continuation return type", () => {
		const step = DInvocation.createStep("pending", (id: string) => ({ id }));
		const asyncStep = DInvocation.createStep("pending", (id: string) => Promise.resolve({ id }));
		const check = async() => {
			// @ts-expect-error a handler is required
			await step.run();
			// @ts-expect-error the handler must return a result
			await step.run(() => {});
			// @ts-expect-error an asynchronous handler must also return a result
			await step.run(() => Promise.resolve());
			// @ts-expect-error the result must match the continuation return type
			await step.run(() => "invalid");
			// @ts-expect-error an asynchronous result must match the continuation return type
			await step.run(() => Promise.resolve("invalid"));
			// @ts-expect-error the continuation argument remains required
			await step.run(({ nextFunction }) => nextFunction());
			// @ts-expect-error the continuation argument must retain its type
			await step.run(({ nextFunction }) => nextFunction(42));
			// @ts-expect-error an asynchronous continuation requires a promise result
			await asyncStep.run(() => ({ id: "user-42" }));
		};

		expect(check).toBeTypeOf("function");
	});
});
