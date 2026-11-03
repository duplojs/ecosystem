import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("workflowCommitGenerator", () => {
	it("yields a named effect with its variadic inputs and discards the resumed value", () => {
		const user = { name: "Ada" } as const;
		const generator = DInvocation.workflowCommitGenerator("save", 42, user);

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			DInvocation.WorkflowCommitGenerator<"save", [number, typeof user]>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);

		type _CheckEffect = DCommon.ExpectType<
			typeof step.value,
			DInvocation.WorkflowEffectCommit<"save", (id: number, input: typeof user) => unknown>,
			"strict"
		>;

		expect(DInvocation.workflowEffectCommitKind.has(step.value)).toBe(true);
		expect(DInvocation.workflowEffectResolveKind.has(step.value)).toBe(false);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("commit/save");
		expect(step.value.input).toStrictEqual([42, user]);
		expect(generator.next("discarded")).toStrictEqual({
			done: true,
			value: undefined,
		});
		expect(generator.next()).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("supports a commit without input arguments", () => {
		const generator = DInvocation.workflowCommitGenerator("notify");

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			DInvocation.WorkflowCommitGenerator<"notify", []>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(step.value.input).toStrictEqual([]);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("commit/notify");
		expect(generator.next()).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("withSignature accepts non-Either results and preserves the current generator state", () => {
		type Save = (id: number, enabled: boolean) => Promise<number | DEither.Left<"save-error", string>>;
		const generator = DInvocation.workflowCommitGenerator("save", 42, true);
		const step = generator.next();
		const signedGenerator = generator.withSignature<Save>();

		type _CheckGenerator = DCommon.ExpectType<
			typeof signedGenerator,
			Generator<DInvocation.WorkflowEffectCommit<"save", Save>, void>,
			"strict"
		>;

		expect(signedGenerator).toBe(generator);
		expect(step.done).toBe(false);
		expect(signedGenerator.next(1)).toStrictEqual({
			done: true,
			value: undefined,
		});

		const check = () => {
			// @ts-expect-error the signature must accept the numeric first input
			generator.withSignature<(id: string, enabled: boolean) => void>();
			// @ts-expect-error the signature must accept the boolean second input
			generator.withSignature<(id: number, enabled: string) => void>();
			// @ts-expect-error the signature cannot require an argument that the effect does not provide
			generator.withSignature<(id: number, enabled: boolean, name: string) => void>();
		};

		expect(check).toBeTypeOf("function");
	});
});

describe("consumeWorkflow commit", () => {
	const commitFailure = DEither.left("save-error", "42");

	it("executes a commit without arguments", async() => {
		const run = vi.fn(() => DEither.ok());
		const workflow = DInvocation.createWorkflow(({ commit }) => function *() {
			return yield *commit("run");
		});
		const result = DInvocation.consumeWorkflow(workflow(), { "commit/run": run });

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<void>, "strict">;

		await expect(result).resolves.toBeUndefined();
		expect(run).toHaveBeenCalledExactlyOnceWith();
	});

	it.each([
		{ output: undefined },
		{ output: null },
		{ output: false },
		{ output: 0 },
		{ output: "discarded" },
		{ output: DEither.success("discarded") },
	])("discards a successful commit return value: $output", async({ output }) => {
		const input = { id: "42" } as const;
		const workflow = DInvocation.createWorkflow(({ commit }) => function *() {
			const committed = yield *commit("save", input);

			type _CheckCommitted = DCommon.ExpectType<typeof committed, void, "strict">;

			expect(committed).toBeUndefined();
			return "done" as const;
		});
		const save = vi.fn((params: typeof input) => {
			expect(params).toBe(input);
			return output;
		});
		const result = DInvocation.consumeWorkflow(workflow(), { "commit/save": save });

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;

		await expect(result).resolves.toBe("done");
		expect(save).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("awaits commits before running the next effect and ignores their fulfilled values", async() => {
		const pending = DCommon.createExternalPromise<42>();
		const started = DCommon.createExternalPromise<undefined>();
		const save = vi.fn((input: string) => {
			expect(input).toBe("42");
			started.resolve(undefined);
			return pending.promise;
		});
		const notify = vi.fn<(input?: unknown) => void>();
		const workflow = DInvocation.createWorkflow(({ commit }) => function *() {
			const committed = yield *commit("save", "42");

			expect(committed).toBeUndefined();
			yield *commit("notify", "saved");
			return "done" as const;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"commit/save": save,
			"commit/notify": notify,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;

		await started.promise;
		expect(notify).not.toHaveBeenCalled();
		pending.resolve(42);
		await expect(result).resolves.toBe("done");
		expect(save).toHaveBeenCalledExactlyOnceWith("42");
		expect(notify).toHaveBeenCalledExactlyOnceWith("saved");
		expect(save).toHaveBeenCalledBefore(notify);
	});

	it("infers commit inputs and asynchronous Left outputs without an explicit signature", async() => {
		const failure = DEither.left("save-error", "42");
		const workflow = DInvocation.createWorkflow(({ commit }) => function *() {
			yield *commit("save", { id: "42" });
			return "done" as const;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"commit/save"(input) {
				type _CheckInput = DCommon.ExpectType<typeof input, { id: string }, "strict">;

				expect(input).toStrictEqual({ id: "42" });
				return Promise.resolve(failure);
			},
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof failure>, "strict">;

		const output = await result;

		expect(output).toBe(failure);
		expect(DEither.unwrapByInformationOrThrow(output, "save-error")).toBe("42");
	});

	it("preserves an explicit commit signature and infers all possible Left outputs", async() => {
		type Save = (input: { id: string }, attempts: number) => DCommon.MaybePromise<
			number | DEither.Left<"save-error", number>
		>;
		const workflow = DInvocation.createWorkflow(({ resolve, commit, breakIfLeft }) => function *(
			input: DEither.Success<string> | DEither.Left<"break-error", undefined>,
		) {
			const selected = yield *breakIfLeft(input);
			const id = yield *resolve("read", selected).expect<string>();
			const committed = yield *commit("save", { id }, 3).withSignature<Save>();

			type _CheckCommitted = DCommon.ExpectType<typeof committed, void, "strict">;

			expect(committed).toBeUndefined();
			return id;
		});
		const result = DInvocation.consumeWorkflow(workflow(DEither.success("42")), {
			"resolve/read": (): Promise<DEither.Success<string> | DEither.Left<"read-error", undefined>> => (
				Promise.resolve(DEither.success("42"))
			),
			"commit/save"(input, attempts): ReturnType<Save> {
				type _CheckInput = DCommon.ExpectType<typeof input, { id: string }, "strict">;
				type _CheckAttempts = DCommon.ExpectType<typeof attempts, number, "strict">;

				expect(input).toStrictEqual({ id: "42" });
				expect(attempts).toBe(3);
				return Promise.resolve(1);
			},
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<
				| string
				| DEither.Left<"break-error", undefined>
				| DEither.Left<"read-error", undefined>
				| DEither.Left<"save-error", number>
			>,
			"strict"
		>;

		await expect(result).resolves.toBe("42");
	});

	it.each([
		{
			label: "synchronous",
			fail: () => commitFailure,
			failure: commitFailure,
		},
		{
			label: "asynchronous",
			fail: () => Promise.resolve(commitFailure),
			failure: commitFailure,
		},
	])("stops on a $label commit Left and preserves its type and identity", async({ fail, failure }) => {
		const cleanup = vi.fn<(input?: unknown) => void>();
		const resumed = vi.fn<(input?: unknown) => void>();
		const skipped = vi.fn(() => DEither.success(42));
		const workflow = DInvocation.createWorkflow(({ commit, resolve }) => function *() {
			try {
				yield *commit("save", { id: "42" });
				resumed();
				return yield *resolve("skipped", undefined).expect<number>();
			} finally {
				cleanup();
			}
		});
		const save = vi.fn(fail);
		const result = DInvocation.consumeWorkflow(workflow(), {
			"commit/save": save,
			"resolve/skipped": skipped,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<number | typeof failure>, "strict">;

		const output = await result;

		expect(output).toBe(failure);
		expect(DEither.unwrapByInformationOrThrow(output, "save-error")).toBe("42");
		expect(save).toHaveBeenCalledExactlyOnceWith({ id: "42" });
		expect(resumed).not.toHaveBeenCalled();
		expect(skipped).not.toHaveBeenCalled();
		expect(cleanup).toHaveBeenCalledOnce();
	});

	it.each([
		{
			label: "throw",
			run: () => {
				throw new Error("effect failure");
			},
		},
		{
			label: "reject",
			run: () => Promise.reject(new Error("effect failure")),
		},
	])("propagates a commit $label, runs synchronous cleanup and skips subsequent effects", async({ run }) => {
		const skipped = vi.fn<(input?: unknown) => void>();
		const cleanup = vi.fn();
		const workflow = DInvocation.createWorkflow(({ commit }) => function *() {
			try {
				yield *commit("run", undefined);
				yield *commit("skipped", undefined);
			} finally {
				cleanup();
			}
		});
		const generator = workflow();

		await expect(DInvocation.consumeWorkflow(generator, {
			"commit/run": run,
			"commit/skipped": skipped,
		})).rejects.toThrow("effect failure");
		expect(skipped).not.toHaveBeenCalled();
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});
});
