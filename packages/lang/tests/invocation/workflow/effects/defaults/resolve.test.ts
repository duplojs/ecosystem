import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("workflowResolveGenerator", () => {
	it("yields a named effect with its variadic inputs and returns the resumed value", () => {
		const context = { source: "main" } as const;
		const generator = DInvocation.workflowResolveGenerator("findUser", 42, context);

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			DInvocation.WorkflowResolveGenerator<"findUser", [42, typeof context], unknown>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);

		type _CheckEffect = DCommon.ExpectType<
			typeof step.value,
			DInvocation.WorkflowEffectResolve<"findUser", [42, typeof context], unknown>,
			"strict"
		>;

		expect(DInvocation.workflowEffectResolveKind.has(step.value)).toBe(true);
		expect(DInvocation.workflowEffectCommitKind.has(step.value)).toBe(false);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("resolve/findUser");
		expect(step.value.input).toStrictEqual([42, context]);

		const user = { name: "Ada" };
		const result = generator.next(user);

		expect(result.done).toBe(true);
		expect(result.value).toBe(user);
		expect(generator.next()).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("supports a resolve without input arguments", () => {
		const generator = DInvocation.workflowResolveGenerator("read");

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			DInvocation.WorkflowResolveGenerator<"read", [], unknown>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(step.value.input).toStrictEqual([]);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("resolve/read");
		expect(generator.next(undefined)).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("expect narrows the output contract without replacing or restarting the generator", () => {
		const generator = DInvocation.workflowResolveGenerator("read", "42");
		const step = generator.next();
		const expectedGenerator = generator.expect<number>();

		type _CheckGenerator = DCommon.ExpectType<
			typeof expectedGenerator,
			Generator<DInvocation.WorkflowEffectResolve<"read", ["42"], number>, number>,
			"strict"
		>;

		expect(expectedGenerator).toBe(generator);
		expect(step.done).toBe(false);
		expect(expectedGenerator.next(42)).toStrictEqual({
			done: true,
			value: 42,
		});
	});

	it("infers the output from an annotated generator and restricts expect to that contract", () => {
		const generator: DInvocation.WorkflowResolveGenerator<"read", [], string> = (
			DInvocation.workflowResolveGenerator("read")
		);
		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);

		type _CheckEffect = DCommon.ExpectType<
			typeof step.value,
			DInvocation.WorkflowEffectResolve<"read", [], string>,
			"strict"
		>;

		expect(generator.next("Ada")).toStrictEqual({
			done: true,
			value: "Ada",
		});

		const check = () => {
			// @ts-expect-error expect cannot contradict the existing string output contract
			generator.expect<number>();
		};

		expect(check).toBeTypeOf("function");
	});
});

describe("consumeWorkflow resolve", () => {
	const resolveFailure = DEither.left("not-found", "42");

	it("keeps a Left carried by a Right as data and resumes subsequent effects", async() => {
		const payload = DEither.left("payload", 42);
		const after = vi.fn<(value: typeof payload) => void>();
		const workflow = DInvocation.createWorkflow(({ resolve, breakIfLeft, commit }) => function *() {
			const value: typeof payload = yield *resolve("payload");
			const checked = yield *breakIfLeft(DEither.success(value));

			yield *commit("after", checked);
			return checked;
		});
		const result = await DInvocation.consumeWorkflow(workflow(), {
			"resolve/payload": () => DEither.success(payload),
			"commit/after": after,
		});

		expect(result).toBe(payload);
		expect(after).toHaveBeenCalledExactlyOnceWith(payload);
	});

	it("infers a resolve output from its variable annotation and unwraps the Right", async() => {
		const input = { id: "42" } as const;
		const user = { name: "Ada" } as const;
		const workflow = DInvocation.createWorkflow(({ resolve }) => function *(params: typeof input) {
			const result: typeof user = yield *resolve("findUser", params);

			type _CheckResolved = DCommon.ExpectType<typeof result, typeof user, "strict">;

			expect(result).toBe(user);
			return result;
		});
		const findUser = vi.fn((params: typeof input) => {
			expect(params).toBe(input);
			return DEither.right("found", user);
		});
		const result = DInvocation.consumeWorkflow(workflow(input), { "resolve/findUser": findUser });

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof user>, "strict">;

		await expect(result).resolves.toBe(user);
		expect(findUser).toHaveBeenCalledExactlyOnceWith(input);

		const check = async() => {
			await DInvocation.consumeWorkflow(workflow(input), {
				// @ts-expect-error the receiving annotation requires the declared user type in the Right
				"resolve/findUser": () => DEither.success({ name: 42 }),
			});
		};

		expect(check).toBeTypeOf("function");
	});

	it("keeps an unspecified resolve output unknown and infers the implementation input", async() => {
		const workflow = DInvocation.createWorkflow(({ resolve }) => function *() {
			const result = yield *resolve("read", { id: "42" });

			type _CheckResolved = DCommon.ExpectType<typeof result, unknown, "strict">;

			return result;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"resolve/read"(input) {
				type _CheckInput = DCommon.ExpectType<typeof input, { readonly id: "42" }, "strict">;

				expect(input).toStrictEqual({ id: "42" });
				return DEither.success(42);
			},
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<unknown>, "strict">;

		await expect(result).resolves.toBe(42);
	});

	it("infers an asynchronous resolve output from its variable annotation and awaits it before the next commit", async() => {
		const pending = DCommon.createExternalPromise<DEither.Success<string>>();
		const started = DCommon.createExternalPromise<undefined>();
		const read = vi.fn(() => {
			started.resolve(undefined);
			return pending.promise;
		});
		const save = vi.fn<(value: string) => void>();
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			const name: string = yield *resolve("read");

			type _CheckName = DCommon.ExpectType<typeof name, string, "strict">;

			yield *commit("save", name);
			return name;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"resolve/read": read,
			"commit/save": save,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;

		await started.promise;
		expect(save).not.toHaveBeenCalled();
		pending.resolve(DEither.success("Ada"));
		await expect(result).resolves.toBe("Ada");
		expect(read).toHaveBeenCalledExactlyOnceWith();
		expect(save).toHaveBeenCalledExactlyOnceWith("Ada");
		expect(read).toHaveBeenCalledBefore(save);

		const check = async() => {
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error the receiving annotation requires a string even for an asynchronous Right
				"resolve/read": () => Promise.resolve(DEither.success(42)),
				"commit/save": save,
			});
		};

		expect(check).toBeTypeOf("function");
	});

	it.each([
		{ value: undefined },
		{ value: null },
		{ value: false },
		{ value: 0 },
		{ value: "" },
	])("resumes the generator with a falsy resolved value: $value", async({ value }) => {
		const resumed = vi.fn<(input?: unknown) => void>();
		const workflow = DInvocation.createWorkflow(({ resolve, breakIfLeft }) => function *() {
			const result = yield *resolve("read", undefined).expect<typeof value>();
			const checked = yield *breakIfLeft(DEither.success(result));

			type _CheckResolved = DCommon.ExpectType<typeof result, typeof value, "strict">;
			type _CheckChecked = DCommon.ExpectType<typeof checked, typeof value, "strict">;

			resumed(checked);
			return checked;
		});
		const result = DInvocation.consumeWorkflow(workflow(), { "resolve/read": () => DEither.success(value) });

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof value>, "strict">;

		await expect(result).resolves.toBe(value);
		expect(resumed).toHaveBeenCalledExactlyOnceWith(value);
	});

	it.each([
		{
			label: "synchronous",
			fail: () => resolveFailure,
			failure: resolveFailure,
		},
		{
			label: "asynchronous",
			fail: () => Promise.resolve(resolveFailure),
			failure: resolveFailure,
		},
	])("stops on a $label resolve Left, closes the generator and skips later commits", async({ fail, failure }) => {
		const cleanup = vi.fn<(input?: unknown) => void>();
		const resumed = vi.fn<(input?: unknown) => void>();
		const save = vi.fn<(input?: unknown) => void>();
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			try {
				const name = yield *resolve("find", "42").expect<string>();
				resumed(name);
				yield *commit("save", name);
				return "done" as const;
			} finally {
				cleanup();
			}
		});
		const generator = workflow();
		const find = vi.fn(fail);
		const result = DInvocation.consumeWorkflow(generator, {
			"resolve/find": find,
			"commit/save": save,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof failure>, "strict">;

		const output = await result;

		expect(output).toBe(failure);
		expect(DEither.unwrapByInformationOrThrow(output, "not-found")).toBe("42");
		expect(find).toHaveBeenCalledExactlyOnceWith("42");
		expect(resumed).not.toHaveBeenCalled();
		expect(save).not.toHaveBeenCalled();
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});

	it.each([
		{
			label: "throw",
			run: () => {
				throw new Error("resolve failure");
			},
		},
		{
			label: "reject",
			run: () => Promise.reject(new Error("resolve failure")),
		},
	])("propagates a resolve $label, runs synchronous cleanup and skips subsequent effects", async({ run }) => {
		const skipped = vi.fn<(input?: unknown) => void>();
		const cleanup = vi.fn();
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			try {
				yield *resolve("read", undefined).expect<string>();
				yield *commit("skipped", undefined);
			} finally {
				cleanup();
			}
		});
		const generator = workflow();

		await expect(DInvocation.consumeWorkflow(generator, {
			"resolve/read": run,
			"commit/skipped": skipped,
		})).rejects.toThrow("resolve failure");
		expect(skipped).not.toHaveBeenCalled();
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});
});
