import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("createResolver", () => {
	const value = { id: "42" } as const;
	type Value = typeof value;

	it("infers the value before accepting an explicit subscriber contract", async() => {
		type Subscribers = Record<"notify", (input: Value) => DEither.Right<"notified", undefined>>;
		const resolver = DInvocation.createResolver(value)<Subscribers>();
		type _CheckResolver = DCommon.ExpectType<
			typeof resolver,
			DInvocation.Resolver<Value, Subscribers>,
			"strict"
		>;
		expect(DInvocation.resolverKind.has(resolver)).toBe(true);
		const notify = vi.fn((input: Value) => {
			expect(input).toBe(value);
			return DEither.right("notified");
		});
		expect(notify).not.toHaveBeenCalled();
		const result = await resolver.resolve({ notify });
		expect(notify).toHaveBeenCalledExactlyOnceWith(value);
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-success")).toBe(value);
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Right<"resolve-success", Value>,
			"strict"
		>;
	});

	it("infers concrete subscriber returns from a tuple of names and preserves execution order", async() => {
		const resolver = DCommon.pipe(
			value,
			(input) => DInvocation.createResolver(input)<["first", "second", "third"]>(),
		);
		type _CheckResolver = DCommon.ExpectType<
			typeof resolver,
			DInvocation.Resolver<Value, Record<"first" | "second" | "third", (input: Value) => unknown>>,
			"strict"
		>;
		const order: string[] = [];
		const result = await resolver.resolve({
			first(input) {
				type _CheckInput = DCommon.ExpectType<typeof input, Value, "strict">;
				expect(input).toBe(value);
				order.push("first");
				return DEither.success(undefined);
			},
			async second(input) {
				type _CheckInput = DCommon.ExpectType<typeof input, Value, "strict">;
				await Promise.resolve();
				order.push("second");
			},
			third() {
				order.push("third");
			},
		});
		expect(order).toStrictEqual(["first", "second", "third"]);
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-success")).toBe(value);
		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Right<"resolve-success", Value>, "strict">;
	});

	it("resolves an empty subscriber contract", async() => {
		const resolver = DInvocation.createResolver<number>(42)<{}>();
		const result = await resolver.resolve({});
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-success")).toBe(42);
		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Right<"resolve-success", number>, "strict">;
	});

	it("stops at an asynchronous subscriber Left and awaits the handler", async() => {
		const resolver = DInvocation.createResolver(value)<readonly ["first", "fail", "skipped"]>();
		const skipped = vi.fn(() => undefined);
		const result = await resolver.resolve(
			{
				first: () => DEither.success(undefined),
				fail: () => Promise.resolve(DEither.left("subscriber-error", 42)),
				skipped,
			},
			async(error, input) => {
				type _CheckError = DCommon.ExpectType<typeof error, DEither.Left<"subscriber-error", 42>, "strict">;
				type _CheckInput = DCommon.ExpectType<typeof input, Value, "strict">;
				expect(DEither.unwrapByInformationOrThrow(error, "subscriber-error")).toBe(42);
				expect(input).toBe(value);
				await Promise.resolve();
				return "handled" as const;
			},
		);
		expect(skipped).not.toHaveBeenCalled();
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-error")).toBe("handled");
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"resolve-error", "handled">
			| DEither.Right<"resolve-success", Value>,
			"strict"
		>;
	});

	it("runs an asynchronous initial function before subscribers", async() => {
		const resolver = DInvocation.createResolver(value)<["notify"]>();
		const order: string[] = [];
		const run = async(input: Value) => {
			expect(input).toBe(value);
			await Promise.resolve();
			order.push("run");
			return DEither.success(undefined);
		};
		const result = await resolver.runAndResolve(
			run,
			{
				notify(input) {
					type _CheckInput = DCommon.ExpectType<typeof input, Value, "strict">;
					expect(input).toBe(value);
					order.push("notify");
				},
			},
		);
		expect(order).toStrictEqual(["run", "notify"]);
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-success")).toBe(value);
		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Right<"resolve-success", Value>, "strict">;
	});

	it("handles an initial Left and infers all possible errors", async() => {
		const resolver = DInvocation.createResolver(value)<["notify"]>();
		const notify = vi.fn(() => DEither.left("subscriber-error", 42));
		const result = await resolver.runAndResolve(
			() => DEither.left("run-error", "failure"),
			{ notify },
			(error, input) => {
				type _CheckError = DCommon.ExpectType<
					typeof error,
					| DEither.Left<"run-error", "failure">
					| DEither.Left<"subscriber-error", 42>,
					"strict"
				>;
				type _CheckInput = DCommon.ExpectType<typeof input, Value, "strict">;
				expect(DEither.unwrapByInformationOrThrow(error, "run-error")).toBe("failure");
				expect(input).toBe(value);
				return "handled" as const;
			},
		);
		expect(notify).not.toHaveBeenCalled();
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-error")).toBe("handled");
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"resolve-error", "handled">
			| DEither.Right<"resolve-success", Value>,
			"strict"
		>;
	});

	it("awaits the handler of an asynchronous initial Left", async() => {
		const resolver = DInvocation.createResolver(value)<{}>();
		const result = await resolver.runAndResolve(
			() => Promise.resolve(DEither.left("run-error")),
			{},
			(error) => {
				type _CheckError = DCommon.ExpectType<typeof error, DEither.Left<"run-error", undefined>, "strict">;
				return Promise.resolve(42 as const);
			},
		);
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-error")).toBe(42);
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"resolve-error", 42>
			| DEither.Right<"resolve-success", Value>,
			"strict"
		>;
	});

	it("handles a synchronous subscriber Left after the initial function succeeds", async() => {
		const resolver = DInvocation.createResolver(value)<["notify"]>();
		const result = await resolver.runAndResolve(
			() => undefined,
			{ notify: () => DEither.left("subscriber-error") },
			(error, input) => {
				type _CheckError = DCommon.ExpectType<typeof error, DEither.Left<"subscriber-error", undefined>, "strict">;
				expect(input).toBe(value);
				return 42 as const;
			},
		);
		expect(DEither.unwrapByInformationOrThrow(result, "resolve-error")).toBe(42);
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"resolve-error", 42>
			| DEither.Right<"resolve-success", Value>,
			"strict"
		>;
	});

	it("propagates thrown errors and rejected promises", async() => {
		const resolver = DInvocation.createResolver(value)<["notify"]>();
		const error = new Error("failure");
		await expect(resolver.resolve({
			notify: () => {
				throw error;
			},
		})).rejects.toBe(error);
		await expect(resolver.runAndResolve(
			() => Promise.reject(error),
			{ notify: () => undefined },
		)).rejects.toBe(error);
		await expect(resolver.resolve(
			{ notify: () => DEither.left("subscriber-error") },
			() => Promise.reject(error),
		)).rejects.toBe(error);
	});

	it("requires the factory call, declared subscribers and error handlers for Left results", () => {
		const check = async() => {
			const factory = DInvocation.createResolver(value);
			// @ts-expect-error the generic factory must be invoked to create a resolver
			await factory.resolve({});
			// @ts-expect-error value must satisfy an explicitly provided value contract
			DInvocation.createResolver<number>(value)<{}>();
			// @ts-expect-error subscriber parameters must match the inferred value contract
			DInvocation.createResolver(value)<Record<"notify", (input: number) => unknown>>();
			const resolver = DInvocation.createResolver(value)<["notify"]>();
			// @ts-expect-error all named subscribers must be provided
			await resolver.resolve({});
			// @ts-expect-error subscriber parameters must match the captured value
			await resolver.resolve({ notify: (input: number) => DEither.success(input) });
			// @ts-expect-error a subscriber Left requires an error handler
			await resolver.resolve({ notify: () => DEither.left("failure") });
			// @ts-expect-error an initial Left requires an error handler
			await resolver.runAndResolve(() => DEither.left("failure"), { notify: () => undefined });
			// @ts-expect-error subscriber Left also requires a handler with runAndResolve
			await resolver.runAndResolve(() => undefined, { notify: () => DEither.left("failure") });
			// @ts-expect-error a handler is unnecessary when no Left can be returned
			await resolver.resolve({ notify: () => undefined }, () => undefined);
			// @ts-expect-error a handler is unnecessary when neither initial function nor subscribers return Left
			await resolver.runAndResolve(() => undefined, { notify: () => undefined }, () => undefined);
		};
		expect(check).toBeTypeOf("function");
	});
});
