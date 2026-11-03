import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("consumeWorkflow", () => {
	it("initializes once and preserves the generator parameters and result", async() => {
		const initialize = vi.fn(({ resolve, commit, breakIfLeft, iterate }: DInvocation.CreateWorkflowInitParams) => {
			expect(resolve).toBe(DInvocation.createWorkflowInitParams.resolve);
			expect(commit).toBe(DInvocation.createWorkflowInitParams.commit);
			expect(breakIfLeft).toBe(DInvocation.createWorkflowInitParams.breakIfLeft);
			expect(iterate).toBe(DInvocation.createWorkflowInitParams.iterate);

			return function *(name: string, count: number) {
				return {
					name,
					count,
				};
			};
		});
		const workflow = DInvocation.createWorkflow(initialize);

		type _CheckWorkflow = DCommon.ExpectType<
			typeof workflow,
			(name: string, count: number) => Generator<never, {
				name: string;
				count: number;
			}, unknown>,
			"strict"
		>;

		expect(initialize).toHaveBeenCalledExactlyOnceWith(DInvocation.createWorkflowInitParams);
		expect(await DInvocation.consumeWorkflow(workflow("first", 1), {})).toStrictEqual({
			name: "first",
			count: 1,
		});
		expect(await DInvocation.consumeWorkflow(workflow("second", 2), {})).toStrictEqual({
			name: "second",
			count: 2,
		});
		expect(initialize).toHaveBeenCalledTimes(1);
	});

	it.each([
		{ value: undefined },
		{ value: null },
		{ value: false },
		{ value: 0 },
		{ value: "" },
		{ value: { id: "42" } },
	])("returns $value without effects", async({ value }) => {
		const workflow = DInvocation.createWorkflow(() => function *() {
			return value;
		});
		const result = DInvocation.consumeWorkflow(workflow(), {});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof value>, "strict">;

		await expect(result).resolves.toBe(value);
	});

	it("awaits a promised generator return value", async() => {
		const workflow = DInvocation.createWorkflow(() => function *() {
			return Promise.resolve(42 as const);
		});
		const result = DInvocation.consumeWorkflow(workflow(), {});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<42>, "strict">;

		await expect(result).resolves.toBe(42);
	});

	it("distinguishes resolve and commit implementations with the same name and infers variadic inputs", async() => {
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			const name = yield *resolve("user", 42, "main").expect<string>();
			const committed = yield *commit("user", 42, name, true);

			type _CheckName = DCommon.ExpectType<typeof name, string, "strict">;
			type _CheckCommitted = DCommon.ExpectType<typeof committed, void, "strict">;

			expect(committed).toBeUndefined();
			return name;
		});
		const read = vi.fn<(id: number, source: string) => void>();
		const save = vi.fn<(id: number, name: string, enabled: boolean) => void>();
		const result = DInvocation.consumeWorkflow(workflow(), {
			"resolve/user"(id, source) {
				type _CheckId = DCommon.ExpectType<typeof id, 42, "strict">;
				type _CheckSource = DCommon.ExpectType<typeof source, "main", "strict">;

				read(id, source);
				return DEither.success("Ada");
			},
			"commit/user"(id, name, enabled) {
				type _CheckId = DCommon.ExpectType<typeof id, number, "strict">;
				type _CheckName = DCommon.ExpectType<typeof name, string, "strict">;
				type _CheckEnabled = DCommon.ExpectType<typeof enabled, boolean, "strict">;

				save(id, name, enabled);
			},
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;

		await expect(result).resolves.toBe("Ada");
		expect(read).toHaveBeenCalledExactlyOnceWith(42, "main");
		expect(save).toHaveBeenCalledExactlyOnceWith(42, "Ada", true);
		expect(read).toHaveBeenCalledBefore(save);
	});

	it("orchestrates injected parameters, nested workflows and repeated effect names in order", async() => {
		const nested = DInvocation.createWorkflow(({ resolve, commit }) => function *(id: number) {
			const name = yield *resolve("findName", id).expect<string>();
			yield *commit("notify", name);
			return name;
		});
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			const id = yield *resolve("getId", undefined).expect<number>();
			const first = yield *nested(id);
			const second = yield *nested(id + 1);
			yield *commit("notify", `${first}/${second}`);
			return {
				first,
				second,
			};
		});
		const getId = vi.fn(() => DEither.success(41));
		const findName = vi.fn((id: number) => DEither.success(`user-${id}`));
		const notify = vi.fn<(input?: unknown) => void>();
		const result = DInvocation.consumeWorkflow(workflow(), {
			"resolve/getId": getId,
			"resolve/findName": findName,
			"commit/notify": notify,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{
				first: string;
				second: string;
			}>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual({
			first: "user-41",
			second: "user-42",
		});
		expect(getId).toHaveBeenCalledExactlyOnceWith(undefined);
		expect(findName).toHaveBeenCalledTimes(2);
		expect(findName).toHaveBeenNthCalledWith(1, 41);
		expect(findName).toHaveBeenNthCalledWith(2, 42);
		expect(notify).toHaveBeenCalledTimes(3);
		expect(notify).toHaveBeenNthCalledWith(1, "user-41");
		expect(notify).toHaveBeenNthCalledWith(2, "user-42");
		expect(notify).toHaveBeenNthCalledWith(3, "user-41/user-42");
		expect(getId).toHaveBeenCalledBefore(findName);
	});

	it("accepts independent implementations for separate consumptions of the same workflow", async() => {
		const workflow = DInvocation.createWorkflow(({ resolve }) => function *() {
			return yield *resolve("read", undefined).expect<string>();
		});
		const firstEffects = { "resolve/read": () => DEither.success("first") };
		const first = DInvocation.consumeWorkflow(workflow(), firstEffects);
		const second = DInvocation.consumeWorkflow(workflow(), { "resolve/read": () => DEither.success("second") });

		await expect(first).resolves.toBe("first");
		await expect(second).resolves.toBe("second");
	});

	it("propagates exceptions thrown by the generator before and after an effect", async() => {
		const error = new Error("workflow failure");
		const before = DInvocation.createWorkflow(() => function *() {
			throw error;
		});
		const after = DInvocation.createWorkflow(({ commit }) => function *() {
			yield *commit("save", undefined);
			throw error;
		});
		const save = vi.fn<(input?: unknown) => void>();

		await expect(DInvocation.consumeWorkflow(before(), {})).rejects.toBe(error);
		await expect(DInvocation.consumeWorkflow(after(), { "commit/save": save })).rejects.toBe(error);
		expect(save).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it("requires declared effects, compatible inputs, resolve outputs and commit signatures", () => {
		const breakWorkflow = DInvocation.createWorkflow(({ breakIfLeft }) => function *() {
			return yield *breakIfLeft(DEither.success(42));
		});
		const emptyWorkflow = DInvocation.createWorkflow(() => function *() {
			return "done" as const;
		});
		const unknownOutputWorkflow = DInvocation.createWorkflow(({ resolve }) => function *() {
			return yield *resolve("read");
		});
		const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *() {
			const id = yield *resolve("read", undefined).expect<string>();
			yield *commit("save", id).withSignature<(input: string) => DEither.Ok>();
		});
		const check = async() => {
			// @ts-expect-error breakIfLeft only accepts a Left or a Right
			DInvocation.createWorkflowInitParams.breakIfLeft(42);
			// @ts-expect-error a workflow must yield supported effects rather than plain values
			DInvocation.createWorkflow(() => function *() {
				yield 42;
			});
			// @ts-expect-error valid effects do not permit additional unsupported yields
			DInvocation.createWorkflow(({ commit }) => function *() {
				yield *commit("save", "42");
				yield "unsupported";
			});
			// @ts-expect-error a workflow must return a generator
			DInvocation.createWorkflow(() => () => 42);
			// @ts-expect-error breakIfLeft expects a resolved Either rather than a promise
			DInvocation.createWorkflowInitParams.breakIfLeft(Promise.resolve(DEither.success(42)));
			// @ts-expect-error breakIfLeft does not require an effect implementation
			await DInvocation.consumeWorkflow(breakWorkflow(), { "break-if-left": () => DEither.success(42) });
			// @ts-expect-error a workflow without effects must not receive any implementation
			await DInvocation.consumeWorkflow(emptyWorkflow(), { unused: () => undefined });
			const emptyEffects = { "commit/unused": () => undefined };
			// @ts-expect-error extra effects are forbidden in variables even for an empty workflow
			await DInvocation.consumeWorkflow(emptyWorkflow(), emptyEffects);
			// @ts-expect-error undeclared resolve effects are forbidden in object literals
			await DInvocation.consumeWorkflow(workflow(), {
				"resolve/read": () => DEither.success("42"),
				"commit/save": () => DEither.ok(),
				"resolve/unused": () => DEither.success("unused"),
			});
			const extraEffects = {
				"resolve/read": () => DEither.success("42"),
				"commit/save": () => DEither.ok(),
				"commit/unused": () => undefined,
			};
			// @ts-expect-error undeclared commit effects are forbidden even in preconstructed objects
			await DInvocation.consumeWorkflow(workflow(), extraEffects);
			// @ts-expect-error numeric keys cannot name a declared effect
			await DInvocation.consumeWorkflow(workflow(), {
				"resolve/read": () => DEither.success("42"),
				"commit/save": () => DEither.ok(),
				0: () => undefined,
			});
			await DInvocation.consumeWorkflow(unknownOutputWorkflow(), {
				// @ts-expect-error resolve still requires an Either when its output contract is unknown
				"resolve/read": () => 42,
			});
			// @ts-expect-error all effects must be implemented
			await DInvocation.consumeWorkflow(workflow(), {});
			// @ts-expect-error the save effect is required
			await DInvocation.consumeWorkflow(workflow(), { "resolve/read": () => DEither.success("42") });
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error the read effect must resolve a string
				"resolve/read": () => DEither.success(42),
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error resolve implementations must return a Left or a Right
				"resolve/read": () => "42",
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error asynchronous resolve implementations must also return an Either
				"resolve/read": () => Promise.resolve("42"),
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error an asynchronous Right must contain the expected string
				"resolve/read": () => Promise.resolve(DEither.success(42)),
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error resolve inputs must match the captured arguments
				"resolve/read": (input: number) => DEither.success("42"),
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				// @ts-expect-error effect names must include their resolve or commit prefix
				read: () => DEither.success("42"),
				"commit/save": () => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				"resolve/read": () => DEither.success("42"),
				// @ts-expect-error the save input must accept the resolved string
				"commit/save": (input: number) => DEither.ok(),
			});
			await DInvocation.consumeWorkflow(workflow(), {
				"resolve/read": () => DEither.success("42"),
				// @ts-expect-error the explicit save signature requires an Ok return value
				"commit/save": () => undefined,
			});
			// @ts-expect-error a commit signature must accept its input
			DInvocation.createWorkflowInitParams.commit("save", "42").withSignature<(input: number) => void>();
		};

		expect(check).toBeTypeOf("function");
	});
});

describe("consumeWorkflow iterate lifecycle", () => {
	const failure = new Error("iteration failed");
	const cleanupFailure = new Error("cleanup failed");

	function failCleanup(): never {
		throw cleanupFailure;
	}

	it.each([{ original: failure }, { original: undefined }])("preserves rejection $original when synchronous workflow cleanup throws", async({ original }) => {
		const cleanup = vi.fn(() => {
			throw cleanupFailure;
		});
		const after = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *() {});
				yield *commit("after");
			} finally {
				cleanup();
			}
		});
		const generator = workflow();

		await expect(DInvocation.consumeWorkflow(generator, {
			"iterate/items": () => {
				const pending = DCommon.createExternalPromise<never>();

				pending.reject(original);
				return pending.promise;
			},
			"commit/after": after,
		})).rejects.toBe(original);
		expect(cleanup).toHaveBeenCalledOnce();
		expect(after).not.toHaveBeenCalled();
		expect(generator.next().done).toBe(true);
	});

	it("propagates a synchronous workflow cleanup error when closing after a Left", async() => {
		const workflow = DInvocation.createWorkflow(({ iterate }) => function *() {
			try {
				yield *iterate("items")(function *() {});
			} finally {
				failCleanup();
			}
		});

		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": () => DEither.left("blocked"),
		})).rejects.toBe(cleanupFailure);
	});

	it("closes the workflow when source acquisition throws", async() => {
		const cleanup = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate }) => function *() {
			try {
				yield *iterate("items")(function *() {});
			} finally {
				cleanup();
			}
		});
		const generator = workflow();

		await expect(DInvocation.consumeWorkflow(generator, {
			"iterate/items": () => ({
				[Symbol.asyncIterator]: () => {
					throw failure;
				},
			}),
		})).rejects.toBe(failure);
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});

	it.each([
		{
			label: "thrown getter error",
			getIterator: () => {
				throw failure;
			},
		},
		{
			label: "rejected getter promise",
			getIterator: () => Promise.reject(failure),
		},
	])("runs synchronous workflow cleanup and skips later effects after a $label", async({ getIterator }) => {
		const cleanup = vi.fn();
		const visit = vi.fn<(item: number) => void>();
		const after = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *(item: number) {
					yield *commit("visit", item);
				});
				yield *commit("after");
			} finally {
				cleanup();
			}
		});
		const generator = workflow();

		await expect(DInvocation.consumeWorkflow(generator, {
			"iterate/items": getIterator,
			"commit/visit": visit,
			"commit/after": after,
		})).rejects.toBe(failure);
		expect(visit).not.toHaveBeenCalled();
		expect(after).not.toHaveBeenCalled();
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});

	it.each([
		{
			label: "synchronous",
			createSource: function *(closed: () => void) {
				try {
					yield 1;
					throw failure;
				} finally {
					closed();
				}
			},
		},
		{
			label: "asynchronous",
			createSource: async function *(closed: () => void) {
				try {
					yield await Promise.resolve(1);
					throw failure;
				} finally {
					closed();
				}
			},
		},
	])("runs synchronous cleanup and skips later effects after a $label source fails", async({ createSource }) => {
		const sourceClosed = vi.fn();
		const childCleanup = vi.fn<(item: number) => void>();
		const parentCleanup = vi.fn();
		const visit = vi.fn<(item: number) => void>();
		const after = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *(item: number) {
					try {
						yield *commit("visit", item);
					} finally {
						childCleanup(item);
					}
				});
				yield *commit("after");
			} finally {
				parentCleanup();
			}
		});

		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": () => createSource(sourceClosed),
			"commit/visit": visit,
			"commit/after": after,
		})).rejects.toBe(failure);
		expect(visit).toHaveBeenCalledExactlyOnceWith(1);
		expect(childCleanup).toHaveBeenCalledExactlyOnceWith(1);
		expect(sourceClosed).toHaveBeenCalledOnce();
		expect(parentCleanup).toHaveBeenCalledOnce();
		expect(childCleanup).toHaveBeenCalledBefore(sourceClosed);
		expect(sourceClosed).toHaveBeenCalledBefore(parentCleanup);
		expect(after).not.toHaveBeenCalled();
	});

	it("awaits asynchronous cleanup inside an effect implementation before closing the workflow", async() => {
		const pending = DCommon.createExternalPromise<undefined>();
		const cleanupStarted = DCommon.createExternalPromise<undefined>();
		const effectCleanup = vi.fn();
		const workflowCleanup = vi.fn();
		const after = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *() {});
				yield *commit("after");
			} finally {
				workflowCleanup();
			}
		});
		let settled = false;
		const outcome = DCommon.callThen(
			DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": async() => {
					try {
						throw failure;
					} finally {
						cleanupStarted.resolve(undefined);
						await pending.promise;
						effectCleanup();
					}
				},
				"commit/after": after,
			}),
			(value) => value,
			(error) => {
				settled = true;
				return error;
			},
		);

		try {
			await cleanupStarted.promise;
			expect(settled).toBe(false);
			expect(workflowCleanup).not.toHaveBeenCalled();
		} finally {
			pending.resolve(undefined);
			await outcome;
		}
		expect(await outcome).toBe(failure);
		expect(effectCleanup).toHaveBeenCalledOnce();
		expect(workflowCleanup).toHaveBeenCalledOnce();
		expect(effectCleanup).toHaveBeenCalledBefore(workflowCleanup);
		expect(after).not.toHaveBeenCalled();
	});

	it("rejects before pending children finish, closes the source and never starts the next chunk", async() => {
		const first = DCommon.createExternalPromise<undefined>();
		const second = DCommon.createExternalPromise<undefined>();
		const bothStarted = DCommon.createExternalPromise<undefined>();
		const secondClosed = DCommon.createExternalPromise<undefined>();
		const sourceClosing = DCommon.createExternalPromise<undefined>();
		const sourceCleanup = DCommon.createExternalPromise<undefined>();
		const childCleanup = vi.fn((item: number) => {
			if (item === 2) {
				secondClosed.resolve(undefined);
			}
		});
		const parentCleanup = vi.fn();
		const lateEffect = vi.fn<(item: number) => void>();
		const pull = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")(function *(item: number) {
					try {
						yield *commit("work", item);
						yield *commit("lateEffect", item);
					} finally {
						childCleanup(item);
					}
				});
			} finally {
				parentCleanup();
			}
		});
		const outcome = DCommon.callThen(
			DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": {
					concurrency: 2,
					getIterator: async function *() {
						try {
							for (const item of [1, 2, 3]) {
								pull(item);
								yield await Promise.resolve(item);
							}
						} finally {
							sourceClosing.resolve(undefined);
							await sourceCleanup.promise;
						}
					},
				},
				"commit/work": (item) => {
					if (item === 2) {
						bothStarted.resolve(undefined);
						return second.promise;
					}
					return first.promise;
				},
				"commit/lateEffect": lateEffect,
			}),
			(value) => value,
			(error) => error,
		);

		try {
			await bothStarted.promise;
			first.reject(failure);
			await sourceClosing.promise;
			expect(childCleanup).toHaveBeenCalledExactlyOnceWith(1);
			expect(parentCleanup).not.toHaveBeenCalled();
			sourceCleanup.resolve(undefined);
			expect(await outcome).toBe(failure);
			expect(parentCleanup).toHaveBeenCalledOnce();
			expect(childCleanup).toHaveBeenCalledTimes(1);
			expect(lateEffect).not.toHaveBeenCalled();
			expect(pull).toHaveBeenCalledTimes(2);
		} finally {
			first.resolve(undefined);
			second.resolve(undefined);
			sourceCleanup.resolve(undefined);
			await outcome;
			await secondClosed.promise;
		}
		expect(lateEffect).toHaveBeenCalledExactlyOnceWith(2);
		expect(childCleanup).toHaveBeenNthCalledWith(2, 2);
		expect(pull).toHaveBeenCalledTimes(2);
	});

	it("observes a late child rejection after a synchronous callback factory error", async() => {
		const pending = DCommon.createExternalPromise<undefined>();
		const childClosed = DCommon.createExternalPromise<undefined>();
		const childFailure = new Error("child failed later");
		const childCleanup = vi.fn(() => {
			childClosed.resolve(undefined);
		});
		const parentCleanup = vi.fn();
		const pull = vi.fn();
		const after = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, commit }) => function *() {
			try {
				yield *iterate("items")((item: number) => {
					if (item === 2) {
						throw failure;
					}
					return (function *() {
						try {
							yield *commit("work");
							yield *commit("after");
						} finally {
							childCleanup();
						}
					})();
				});
			} finally {
				parentCleanup();
			}
		});
		const outcome = DCommon.callThen(
			DInvocation.consumeWorkflow(workflow(), {
				"iterate/items": {
					concurrency: 2,
					getIterator: function *() {
						for (const item of [1, 2, 3]) {
							pull(item);
							yield item;
						}
					},
				},
				"commit/work": () => pending.promise,
				"commit/after": after,
			}),
			(value) => value,
			(error) => error,
		);

		try {
			expect(await outcome).toBe(failure);
			expect(parentCleanup).toHaveBeenCalledOnce();
			expect(childCleanup).not.toHaveBeenCalled();
			expect(pull).toHaveBeenCalledTimes(2);
		} finally {
			pending.reject(childFailure);
			await childClosed.promise;
			await outcome;
		}
		expect(childCleanup).toHaveBeenCalledOnce();
		expect(parentCleanup).toHaveBeenCalledBefore(childCleanup);
		expect(after).not.toHaveBeenCalled();
		expect(pull).toHaveBeenCalledTimes(2);
	});

	it("runs synchronous child and parent cleanup after a Left and skips later effects", async() => {
		const blocked = DEither.left("blocked", 1);
		const childCleanup = vi.fn();
		const parentCleanup = vi.fn();
		const skipped = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, breakIfLeft, commit }) => function *() {
			try {
				yield *iterate("items")(function *() {
					try {
						yield *breakIfLeft(blocked);
						yield *commit("skipped");
					} finally {
						childCleanup();
					}
				});
				yield *commit("skipped");
			} finally {
				parentCleanup();
			}
		});

		const result = await DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": function *() {
				yield 1;
			},
			"commit/skipped": skipped,
		});

		expect(result).toBe(blocked);
		expect(childCleanup).toHaveBeenCalledOnce();
		expect(parentCleanup).toHaveBeenCalledOnce();
		expect(childCleanup).toHaveBeenCalledBefore(parentCleanup);
		expect(skipped).not.toHaveBeenCalled();
	});

	it("preserves a native source error when synchronous workflow cleanup also throws", async() => {
		const sourceClosed = vi.fn();
		const workflowCleanup = vi.fn(() => {
			throw cleanupFailure;
		});
		const workflow = DInvocation.createWorkflow(({ iterate }) => function *() {
			try {
				yield *iterate("items")(function *() {});
			} finally {
				workflowCleanup();
			}
		});

		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": async function *() {
				try {
					yield await Promise.resolve(1);
					throw failure;
				} finally {
					sourceClosed();
				}
			},
		})).rejects.toBe(failure);
		expect(sourceClosed).toHaveBeenCalledOnce();
		expect(workflowCleanup).toHaveBeenCalledOnce();
	});

	it("runs synchronous workflow cleanup when source closure fails after a Left", async() => {
		const cleanup = vi.fn();
		const sourceClosed = vi.fn();
		const workflow = DInvocation.createWorkflow(({ iterate, breakIfLeft }) => function *() {
			try {
				yield *iterate("items")(function *() {
					yield *breakIfLeft(DEither.left("blocked"));
				});
			} finally {
				cleanup();
			}
		});

		await expect(DInvocation.consumeWorkflow(workflow(), {
			"iterate/items": function *() {
				try {
					yield 1;
					yield 2;
				} finally {
					sourceClosed();
					failCleanup();
				}
			},
		})).rejects.toBe(cleanupFailure);
		expect(cleanup).toHaveBeenCalledOnce();
		expect(sourceClosed).toHaveBeenCalledOnce();
	});
});
