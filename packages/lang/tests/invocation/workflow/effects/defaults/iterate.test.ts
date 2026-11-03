import * as DCommon from "@scripts/common";
import * as DInvocation from "@scripts/invocation";
import * as DGenerator from "@scripts/generator";
import * as DEither from "@scripts/either";

describe("workflowIterateGenerator", () => {
	it("infers an inline callback before validating its effects and preserves annotated resolve outputs", async() => {
		const visit = vi.fn<(value: string) => void>();
		const generator = DInvocation.workflowIterateGenerator("items")(function *(item: number) {
			const value: string = yield *DInvocation.workflowResolveGenerator("read", item);

			type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

			visit(value);
			return { value };
		});

		type IteratorFunction = DGenerator.GetItem<typeof generator>["iteratorFunction"];
		type _CheckInput = DCommon.ExpectType<Parameters<IteratorFunction>, [item: number], "strict">;
		type _CheckEffects = DCommon.ExpectType<
			DGenerator.GetItem<ReturnType<IteratorFunction>>,
			DInvocation.WorkflowEffectResolve<"read", [number], string>,
			"strict"
		>;
		type _CheckReturn = DCommon.ExpectType<
			DGenerator.GetResult<ReturnType<IteratorFunction>>,
			{ value: string },
			"strict"
		>;

		const result = await DInvocation.consumeWorkflow(generator, {
			"iterate/items": function *() {
				yield 42;
			},
			"resolve/read": (item) => {
				type _CheckItem = DCommon.ExpectType<typeof item, number, "strict">;

				return DEither.success(`item-${item}`);
			},
		});

		expect(result).toBeUndefined();
		expect(visit).toHaveBeenCalledExactlyOnceWith("item-42");
	});

	it("captures the name, inputs and typed callback in a pipe and returns void", () => {
		const iteratorFunction = function *(item: string) {
			yield *DInvocation.workflowCommitGenerator("save", item);
			return 42;
		};
		const generator = DCommon.pipe(
			iteratorFunction,
			DInvocation.workflowIterateGenerator("users", 42, true),
		);

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			Generator<DInvocation.WorkflowEffectIterate<"users", [number, boolean], typeof iteratorFunction>, void>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(DInvocation.workflowEffectIterateKind.has(step.value)).toBe(true);
		expect(DInvocation.workflowEffectCommitKind.has(step.value)).toBe(false);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("iterate/users");
		expect(step.value.input).toStrictEqual([42, true]);
		expect(step.value.iteratorFunction).toBe(iteratorFunction);
		expect(generator.next("discarded")).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("supports no inputs and rejects unsupported callback signatures and effects", () => {
		const generator = DInvocation.workflowIterateGenerator("empty")(function *() {});
		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(step.value.input).toStrictEqual([]);

		const check = () => {
			// @ts-expect-error callbacks must yield workflow effects
			DInvocation.workflowIterateGenerator("invalid")(function *() {
				yield 42;
			});
			// @ts-expect-error a known effect cannot hide an unsupported yield in the callback
			DInvocation.workflowIterateGenerator("invalid")(function *(item: number) {
				yield *DInvocation.workflowCommitGenerator("save", item);
				yield "unsupported";
			});
			const invalidCallback = function *() {
				yield 42;
			};
			// @ts-expect-error previously declared callbacks must also only yield known effects
			DInvocation.workflowIterateGenerator("invalid")(invalidCallback);
			// @ts-expect-error callbacks must be synchronous workflow generators
			DInvocation.workflowIterateGenerator("invalid")(async function *() {});
			// @ts-expect-error an iteration only supplies one item
			DInvocation.workflowIterateGenerator("invalid")(function *(item: number, required: string) {});
		};

		expect(check).toBeTypeOf("function");
	});
});

describe("consumeWorkflow iterate", () => {
	const sequential = 1;
	const parallel = 2;
	const getterFailure = DEither.left("iterator-unavailable", "items");

	it.each([
		{
			label: "a synchronous getter",
			implementation: () => getterFailure,
		},
		{
			label: "an asynchronous getter",
			implementation: () => Promise.resolve(getterFailure),
		},
		{
			label: "synchronous options",
			implementation: {
				getIterator: () => getterFailure,
				concurrency: parallel,
			},
		},
		{
			label: "asynchronous options",
			implementation: {
				getIterator: () => Promise.resolve(getterFailure),
				concurrency: sequential,
			},
		},
	])("stops before iteration when $label returns a Left", async({ implementation }) => {
		const visit = vi.fn<(item: number) => void>();
		const after = vi.fn<() => void>();
		const closed = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *(item: number) {
					yield *commit("visit", item);
				});
				yield *commit("after");
				return "done" as const;
			} finally {
				closed();
			}
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": implementation,
			"commit/visit": visit,
			"commit/after": after,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof getterFailure>, "strict">;

		expect(await result).toBe(getterFailure);
		expect(visit).not.toHaveBeenCalled();
		expect(after).not.toHaveBeenCalled();
		expect(closed).toHaveBeenCalledOnce();
	});

	function *syncItems() {
		yield 1;
		yield 2;
		yield 3;
	}

	async function *asyncItems() {
		yield await Promise.resolve(1);
		yield 2;
		yield 3;
	}

	it.each([
		{
			label: "a synchronous iterable",
			implementation: () => DEither.right("items", syncItems()),
		},
		{
			label: "a promised asynchronous iterable",
			implementation: () => Promise.resolve(DEither.success(asyncItems())),
		},
		{
			label: "options with an asynchronous iterable",
			implementation: {
				getIterator: () => DEither.success(asyncItems()),
				concurrency: parallel,
			},
		},
		{
			label: "options with a promised synchronous iterable",
			implementation: {
				getIterator: () => Promise.resolve(DEither.success(syncItems())),
				concurrency: sequential,
			},
		},
	])("unwraps a Right containing $label and discards the iteration results", async({ implementation }) => {
		const visit = vi.fn<(item: number) => void>();
		const after = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			yield *iterate("items")(function *(item: number) {
				yield *commit("visit", item);
				return item;
			});
			yield *commit("after");
			return "done" as const;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": implementation,
			"commit/visit": visit,
			"commit/after": after,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;

		await expect(result).resolves.toBe("done");
		expect(visit).toHaveBeenCalledTimes(3);
		expect(visit).toHaveBeenNthCalledWith(1, 1);
		expect(visit).toHaveBeenNthCalledWith(2, 2);
		expect(visit).toHaveBeenNthCalledWith(3, 3);
		expect(visit).toHaveBeenCalledBefore(after);
	});

	it("infers getter inputs and Left results from nested iteration options", async() => {
		const visit = vi.fn<(item: number) => void>();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *(fail: boolean) {
			yield *iterate("outer")(function *(item: string) {
				yield *iterate("inner", item, fail)(function *(value: number) {
					yield *commit("visit", value);
				});
			});
			return "done" as const;
		});
		const consume = (fail: boolean) => DInvocation.consumeWorkflow(workflow(fail), {
			"iterate/outer": function *() {
				yield "scope";
			},
			"iterate/inner": {
				concurrency: sequential,
				getIterator(scope, shouldFail) {
					type _CheckScope = DCommon.ExpectType<typeof scope, string, "strict">;
					type _CheckFail = DCommon.ExpectType<typeof shouldFail, boolean, "strict">;

					expect(scope).toBe("scope");
					return shouldFail ? getterFailure : DEither.success(syncItems());
				},
			},
			"commit/visit": visit,
		});
		const result = consume(true);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof getterFailure>, "strict">;

		expect(await result).toBe(getterFailure);
		expect(visit).not.toHaveBeenCalled();
		await expect(consume(false)).resolves.toBe("done");
		expect(visit).toHaveBeenCalledTimes(3);
	});

	it("supports callbacks without parameters and repeated iterations", async() => {
		const visit = vi.fn<() => void>();
		const getIterator = vi.fn(function *() {
			yield 1;
			yield 2;
		});
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			const iterateItems = iterate("items");

			yield *iterateItems(function *() {
				yield *commit("visit");
			});
			yield *iterateItems(function *() {
				yield *commit("visit");
			});
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": getIterator,
			"commit/visit": visit,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<void>, "strict">;

		await expect(result).resolves.toBeUndefined();
		expect(getIterator).toHaveBeenCalledTimes(2);
		expect(visit).toHaveBeenCalledTimes(4);
	});

	it("propagates a nested resolve Left and closes a synchronous source", async() => {
		const failure = DEither.left("resolve-error", 1);
		const closed = vi.fn();
		const read = vi.fn(() => failure);
		const after = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ iterate, resolve, commit }) => function *() {
			yield *iterate("items")(function *(item: number) {
				yield *resolve("read", item).expect<string>();
				yield *commit("after");
			});
			return "done" as const;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": function *() {
				try {
					yield 1;
					yield 2;
				} finally {
					closed();
				}
			},
			"resolve/read": read,
			"commit/after": after,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof failure>, "strict">;

		expect(await result).toBe(failure);
		expect(closed).toHaveBeenCalledOnce();
		expect(read).toHaveBeenCalledExactlyOnceWith(1);
		expect(after).not.toHaveBeenCalled();
	});

	it("consumes synchronous sources sequentially with typed inputs and nested effects", async() => {
		const save = vi.fn<(value: string) => void>();
		const after = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ iterate, resolve, commit }) => function *() {
			const output = yield *iterate("users", 42, true)(function *(item: number) {
				const name = yield *resolve("name", item).expect<string>();
				yield *commit("save", name);
				return "ignored" as const;
			});

			type _CheckOutput = DCommon.ExpectType<typeof output, void, "strict">;

			yield *commit("after");
			return "done" as const;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/users": function *(id, enabled) {
				type _CheckId = DCommon.ExpectType<typeof id, number, "strict">;
				type _CheckEnabled = DCommon.ExpectType<typeof enabled, boolean, "strict">;

				expect([id, enabled]).toStrictEqual([42, true]);
				yield 1;
				expect(save).toHaveBeenCalledExactlyOnceWith("user-1");
				yield 2;
				expect(save).toHaveBeenLastCalledWith("user-2");
			},
			"resolve/name": (item) => {
				type _CheckItem = DCommon.ExpectType<typeof item, number, "strict">;

				return DEither.success(`user-${item}`);
			},
			"commit/save": save,
			"commit/after": after,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;

		await expect(result).resolves.toBe("done");
		expect(save).toHaveBeenCalledTimes(2);
		expect(save).toHaveBeenCalledBefore(after);
	});

	it("awaits an asynchronous getter and source with object options and explicit sequential concurrency", async() => {
		const pending = DCommon.createExternalPromise<AsyncGenerator<string>>();
		const started = DCommon.createExternalPromise<undefined>();
		const visit = vi.fn<(item: string) => void>();
		const getIterator = vi.fn((prefix: string) => {
			expect(prefix).toBe("user");
			started.resolve(undefined);
			return pending.promise;
		});
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			yield *iterate("users", "user")(function *(item: string) {
				yield *commit("visit", item);
			});
			return true;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/users": {
				concurrency: sequential,
				getIterator(prefix) {
					type _CheckPrefix = DCommon.ExpectType<typeof prefix, string, "strict">;

					return getIterator(prefix);
				},
			},
			"commit/visit": visit,
		});

		await started.promise;
		expect(visit).not.toHaveBeenCalled();
		pending.resolve((async function *() {
			yield await Promise.resolve("Ada");
			expect(visit).toHaveBeenCalledExactlyOnceWith("Ada");
			yield "Bob";
		})());
		await expect(result).resolves.toBe(true);
		expect(getIterator).toHaveBeenCalledExactlyOnceWith("user");
		expect(visit).toHaveBeenCalledTimes(2);
		expect(visit).toHaveBeenLastCalledWith("Bob");
	});

	it.each([
		{
			label: "a synchronous source",
			wrapIterator: DCommon.forward<Iterable<number>>,
		},
		{
			label: "an asynchronous source",
			wrapIterator: DGenerator.asyncMap(DCommon.forward<number>),
		},
	])("bounds parallel work and waits for the whole batch with $label", async({ wrapIterator }) => {
		const firstItem = DCommon.createExternalPromise<undefined>();
		const secondItem = DCommon.createExternalPromise<undefined>();
		const firstFinished = DCommon.createExternalPromise<undefined>();
		const secondBatch = DCommon.createExternalPromise<undefined>();
		const firstStarted = DCommon.createExternalPromise<undefined>();
		const secondStarted = DCommon.createExternalPromise<undefined>();
		const pull = vi.fn();
		const after = vi.fn<() => void>();
		let active = 0;
		const visit = vi.fn(async(item: number) => {
			active++;
			expect(active).toBeLessThanOrEqual(2);

			if (item === 2) {
				firstStarted.resolve(undefined);
			}
			if (item === 4) {
				secondStarted.resolve(undefined);
			}
			if (item === 1) {
				await firstItem.promise;
			} else if (item === 2) {
				await secondItem.promise;
			} else if (item < 5) {
				await secondBatch.promise;
			}

			active--;
			if (item === 1) {
				firstFinished.resolve(undefined);
			}
		});
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			yield *iterate("items")(function *(item: number) {
				yield *commit("visit", item);
			});
			yield *commit("after");
		});
		const source = (function *() {
			for (const item of [1, 2, 3, 4, 5]) {
				pull(item);
				yield item;
			}
		})();
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": {
				concurrency: parallel,
				getIterator: () => wrapIterator(source),
			},
			"commit/visit": visit,
			"commit/after": after,
		});

		await firstStarted.promise;
		expect(active).toBe(2);
		expect(visit).toHaveBeenCalledTimes(2);
		expect(pull).toHaveBeenCalledTimes(2);
		expect(after).not.toHaveBeenCalled();
		firstItem.resolve(undefined);
		await firstFinished.promise;
		expect(active).toBe(1);
		expect(visit).toHaveBeenCalledTimes(2);
		expect(pull).toHaveBeenCalledTimes(2);
		expect(after).not.toHaveBeenCalled();
		secondItem.resolve(undefined);
		await secondStarted.promise;
		expect(active).toBe(2);
		expect(visit).toHaveBeenCalledTimes(4);
		expect(pull).toHaveBeenCalledTimes(4);
		expect(after).not.toHaveBeenCalled();
		secondBatch.resolve(undefined);
		await expect(result).resolves.toBeUndefined();
		expect(visit).toHaveBeenCalledTimes(5);
		expect(visit).toHaveBeenLastCalledWith(5);
		expect(after).toHaveBeenCalledOnce();
		expect(active).toBe(0);
	});

	it("isolates concurrent consumptions and accepts frozen inputs, options and effect implementations", async() => {
		const firstInput: Readonly<{ run: string }> = Object.freeze({ run: "first" });
		const secondInput: typeof firstInput = Object.freeze({ run: "second" });
		const items = Object.freeze([Object.freeze({ id: 1 }), Object.freeze({ id: 2 })]);
		const firstStarted = DCommon.createExternalPromise<undefined>();
		const secondStarted = DCommon.createExternalPromise<undefined>();
		const pending = DCommon.createExternalPromise<undefined>();
		const after = vi.fn<(input: typeof firstInput) => void>();
		const visit = vi.fn((input: typeof firstInput, item: typeof items[number]) => {
			if (item.id === 2) {
				if (input.run === "first") {
					firstStarted.resolve(undefined);
				} else {
					secondStarted.resolve(undefined);
				}
			}
			return pending.promise;
		});
		const getIterator = vi.fn<(input: typeof firstInput) => typeof items>(() => items);
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *(input: typeof firstInput) {
			yield *iterate("items", input)(function *(item: typeof items[number]) {
				yield *commit("visit", input, item);
			});
			yield *commit("after", input);
			return input.run;
		});
		const effects = Object.freeze({
			"iterate/items": Object.freeze({
				concurrency: parallel,
				getIterator,
			}),
			"commit/visit": visit,
			"commit/after": after,
		});
		const results = DCommon.promiseAll([
			DInvocation.consumeWorkflow(workflow(firstInput), effects),
			DInvocation.consumeWorkflow(workflow(secondInput), effects),
		]);

		await DCommon.promiseAll([firstStarted.promise, secondStarted.promise]);
		expect(visit).toHaveBeenCalledTimes(4);
		expect(after).not.toHaveBeenCalled();
		expect(getIterator).toHaveBeenNthCalledWith(1, firstInput);
		expect(getIterator).toHaveBeenNthCalledWith(2, secondInput);
		expect(visit).toHaveBeenCalledWith(firstInput, items[0]);
		expect(visit).toHaveBeenCalledWith(firstInput, items[1]);
		expect(visit).toHaveBeenCalledWith(secondInput, items[0]);
		expect(visit).toHaveBeenCalledWith(secondInput, items[1]);
		pending.resolve(undefined);
		await expect(results).resolves.toStrictEqual(["first", "second"]);
		expect(after).toHaveBeenCalledTimes(2);
		expect(items).toStrictEqual([{ id: 1 }, { id: 2 }]);
	});

	it("waits for the current batch on a Left, closes both generators and skips subsequent items", async() => {
		const failure = DEither.left("iteration-error", "failed");
		const pending = DCommon.createExternalPromise<undefined>();
		const started = DCommon.createExternalPromise<undefined>();
		const sourceClosed = vi.fn();
		const workflowClosed = vi.fn();
		const pull = vi.fn();
		const after = vi.fn<() => void>();
		const visit = vi.fn((item: number) => {
			if (item === 2) {
				started.resolve(undefined);
				return pending.promise;
			}
			return failure;
		});
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *(item: number) {
					yield *commit("visit", item);
				});
				yield *commit("after");
				return "done" as const;
			} finally {
				workflowClosed();
			}
		});
		const result = DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": {
				concurrency: parallel,
				getIterator: async function *() {
					try {
						for (const item of [1, 2, 3]) {
							pull(item);
							yield await Promise.resolve(item);
						}
					} finally {
						sourceClosed();
					}
				},
			},
			"commit/visit": visit,
			"commit/after": after,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done" | typeof failure>, "strict">;

		await started.promise;
		expect(pull).toHaveBeenCalledTimes(2);
		expect(sourceClosed).not.toHaveBeenCalled();
		expect(workflowClosed).not.toHaveBeenCalled();
		pending.resolve(undefined);
		const output = await result;

		expect(DEither.isLeft(output)).toBe(true);
		expect(output).toBe(failure);
		expect(sourceClosed).toHaveBeenCalledOnce();
		expect(workflowClosed).toHaveBeenCalledOnce();
		expect(pull).toHaveBeenCalledTimes(2);
		expect(after).not.toHaveBeenCalled();
	});

	it("handles empty sources without invoking the callback", async() => {
		const visit = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			yield *iterate("empty")(function *(item: number) {
				yield *commit("visit", item);
			});
			return 42;
		});
		const result = await DInvocation.consumeWorkflow(workflow(), {
			"iterate/empty": function *() {},
			"commit/visit": visit,
		});

		expect(result).toBe(42);
		expect(visit).not.toHaveBeenCalled();
	});

	it("supports nested iterations and propagates nested breakIfLeft and returned Left types", async() => {
		const breakFailure = DEither.left("break-error", 1);
		const returnedFailure = DEither.left("returned-error", 2);
		const after = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ iterate, breakIfLeft, commit }) => function *(fail: boolean) {
			yield *iterate("outer")(function *(parent: number) {
				yield *iterate("inner", parent)(function *(item: string) {
					yield *breakIfLeft(fail ? breakFailure : DEither.success(item));
					return returnedFailure;
				});
			});
			yield *commit("after");
			return "done" as const;
		});
		const effects = {
			"iterate/outer": function *() {
				yield 1;
			},
			"iterate/inner": function *(parent: number) {
				expect(parent).toBe(1);
				yield "child";
			},
			"commit/after": after,
		};
		const result = DInvocation.consumeWorkflow(workflow(true), effects);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<"done" | typeof breakFailure | typeof returnedFailure>,
			"strict"
		>;

		expect(await result).toBe(breakFailure);
		expect(await DInvocation.consumeWorkflow(workflow(false), effects)).toBe(returnedFailure);
		expect(after).not.toHaveBeenCalled();
	});

	it("propagates getter, source and callback exceptions and closes a source after callback failure", async() => {
		const failure = new Error("iteration failed");
		const closed = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate }) => function *() {
			yield *iterate("items")(function *(item: number) {
				if (item === 1) {
					throw failure;
				}
			});
		});

		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": () => {
				throw failure;
			},
		})).rejects.toBe(failure);
		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": async function *() {
				await Promise.reject(failure);
			},
		})).rejects.toBe(failure);
		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": function *() {
				try {
					yield 1;
					yield 2;
				} finally {
					closed();
				}
			},
		})).rejects.toBe(failure);
		expect(closed).toHaveBeenCalledOnce();
	});

	it("requires compatible sources and implementations for nested effects", () => {
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			yield *iterate("items", "scope")(function *(item: number) {
				yield *commit("visit", item);
			});
		});
		const check = async() => {
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error object options require an explicit concurrency
				"iterate/items": { getIterator: syncItems },
				"commit/visit": () => undefined,
			});
			// @ts-expect-error both the iterator and its nested commit must be implemented
			await DInvocation.consumeWorkflow(workflow(), {});
			// @ts-expect-error the nested commit is required
			await DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": function *() {
					yield 1;
				},
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error source items must match the callback's numeric input
				"iterate/items": function *() {
					yield "wrong";
				},
				"commit/visit": () => undefined,
			});
			await DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": {
					concurrency: sequential,
					// @ts-expect-error asynchronous source items must also match the callback
					getIterator: async function *() {
						yield await Promise.resolve("wrong");
					},
				},
				"commit/visit": () => undefined,
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error the getter must accept the captured string input
				"iterate/items": function *(scope: number) {
					yield scope;
				},
				"commit/visit": () => undefined,
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error the getter must return an iterable
				"iterate/items": () => 42,
				"commit/visit": () => undefined,
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error a Right must contain an iterable
				"iterate/items": () => DEither.success(42),
				"commit/visit": () => undefined,
			});
			await DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": {
					concurrency: sequential,
					// @ts-expect-error a wrapped source must yield numeric items matching the callback
					getIterator: () => Promise.resolve(DEither.success((async function *() {
						yield await Promise.resolve("wrong");
					})())),
				},
				"commit/visit": () => undefined,
			});
			// @ts-expect-error unused effect names are forbidden even when iterate uses object options
			await DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": {
					getIterator: function *() {
						yield 1;
					},
					concurrency: parallel,
				},
				"commit/visit": () => undefined,
				"commit/extra": () => undefined,
			});
		};

		expect(check).toBeTypeOf("function");
	});
});
