import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import type * as DGenerator from "@scripts/generator";
import * as DInvocation from "@scripts/invocation";
import type * as DKind from "@scripts/kind";

describe("workflowBreakIfLeftGenerator", () => {
	it.each([
		{
			label: "Right",
			input: DEither.success(42),
		},
		{
			label: "Left",
			input: DEither.left("blocked", "42"),
		},
	])("yields a break effect carrying the original $label", ({ input }) => {
		const generator = DInvocation.workflowBreakIfLeftGenerator(input);

		type _CheckGenerator = DCommon.ExpectType<
			typeof generator,
			Generator<DInvocation.WorkflowEffectBreakIfLeft<typeof input>, 42>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(DInvocation.workflowEffectBreakIfLeftKind.has(step.value)).toBe(true);
		expect(DInvocation.workflowEffectResolveKind.has(step.value)).toBe(false);
		expect(DInvocation.workflowEffectCommitKind.has(step.value)).toBe(false);
		expect(DInvocation.workflowEffectKind.getValue(step.value)).toBe("break-if-left");
		expect(DInvocation.workflowEffectBreakIfLeftKind.getValue(step.value)).toBe(input);
	});

	it.each([
		{ value: undefined },
		{ value: null },
		{ value: false },
		{ value: 0 },
		{ value: "" },
		{ value: { id: "42" } },
	])("returns the value supplied when resuming the generator: $value", ({ value }) => {
		const generator = DInvocation.workflowBreakIfLeftGenerator(DEither.success(value));

		type _CheckResult = DCommon.ExpectType<DGenerator.GetResult<typeof generator>, typeof value, "strict">;

		const step = generator.next();

		expect(step.done).toBe(false);

		const result = generator.next(value);

		expect(result.done).toBe(true);
		expect(result.value).toBe(value);
		expect(generator.next()).toStrictEqual({
			done: true,
			value: undefined,
		});
	});

	it("keeps every Left in the effect type and only Right values in the generator return type", () => {
		const user = { id: "42" } as const;
		type Input = (
			| DEither.Success<typeof user>
			| DEither.Left<"not-found", string>
			| DEither.Left<"invalid", number>
		);
		const input = DEither.success(user) as Input;
		const generator = DInvocation.workflowBreakIfLeftGenerator(input);

		type _CheckResult = DCommon.ExpectType<DGenerator.GetResult<typeof generator>, typeof user, "strict">;
		type _CheckInput = DCommon.ExpectType<
			DKind.GetValue<typeof DInvocation.workflowEffectBreakIfLeftKind, DGenerator.GetItem<typeof generator>>,
			Input,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(DInvocation.workflowEffectBreakIfLeftKind.getValue(step.value)).toBe(input);
		expect(generator.next(user).value).toBe(user);
	});

	it("has no successful return type for a Left-only input and rejects non-Either inputs", () => {
		const input = DEither.left("blocked", "42");
		const generator = DInvocation.workflowBreakIfLeftGenerator(input);

		type _CheckResult = DCommon.ExpectType<DGenerator.GetResult<typeof generator>, never, "strict">;
		type _CheckEffect = DCommon.ExpectType<
			DGenerator.GetItem<typeof generator>,
			DInvocation.WorkflowEffectBreakIfLeft<typeof input>,
			"strict"
		>;

		const step = generator.next();

		DCommon.asserts(step, (value) => value.done !== true);
		expect(DInvocation.workflowEffectBreakIfLeftKind.getValue(step.value)).toBe(input);

		const check = () => {
			// @ts-expect-error breakIfLeft requires an Either rather than a plain value
			DInvocation.workflowBreakIfLeftGenerator(42);
			// @ts-expect-error breakIfLeft requires an Either rather than a promise
			DInvocation.workflowBreakIfLeftGenerator(Promise.resolve(DEither.success(42)));
		};

		expect(check).toBeTypeOf("function");
	});
});

describe("consumeWorkflow breakIfLeft", () => {
	const breakFailure = DEither.left("blocked", "42");

	it("unwraps successive breakIfLeft Rights without requiring implementations", async() => {
		const user = { id: "42" } as const;
		const workflow = DInvocation.createWorkflow(({ breakIfLeft }) => function *() {
			const id = yield *breakIfLeft(DEither.success(42));
			const name = yield *breakIfLeft(DEither.success("Ada"));
			const result = yield *breakIfLeft(DEither.success(user));

			type _CheckId = DCommon.ExpectType<typeof id, 42, "strict">;
			type _CheckName = DCommon.ExpectType<typeof name, "Ada", "strict">;
			type _CheckUser = DCommon.ExpectType<typeof result, typeof user, "strict">;

			expect(result).toBe(user);
			return {
				id,
				name,
			};
		});
		const result = DInvocation.consumeWorkflow(workflow(), {});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{
				id: 42;
				name: "Ada";
			}>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual({
			id: 42,
			name: "Ada",
		});
	});

	it("returns a breakIfLeft Left and closes the generator without requiring implementations", async() => {
		const failure = DEither.left("invalid-user", "42");
		const cleanup = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ breakIfLeft }) => function *() {
			try {
				return yield *breakIfLeft(failure);
			} finally {
				cleanup();
			}
		});
		const generator = workflow();
		const result = DInvocation.consumeWorkflow(generator, {});

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof failure>, "strict">;

		const output = await result;

		expect(output).toBe(failure);
		expect(DEither.unwrapByInformationOrThrow(output, "invalid-user")).toBe("42");
		expect(cleanup).toHaveBeenCalledOnce();
		expect(generator.next().done).toBe(true);
	});

	it.each([
		{
			label: "Right",
			input: DEither.success(42),
			expected: 42,
			expectedCalls: [[42]],
		},
		{
			label: "Left",
			input: breakFailure,
			expected: breakFailure,
			expectedCalls: [],
		},
	])("handles a breakIfLeft $label and infers both outcomes", async({ input, expected, expectedCalls }) => {
		const resumed = vi.fn<(value: 42) => void>();
		const notify = vi.fn<(value: 42) => void>();
		const cleanup = vi.fn<() => void>();
		const workflow = DInvocation.createWorkflow(({ breakIfLeft, commit }) => function *(
			value: DEither.Success<42> | typeof breakFailure,
		) {
			try {
				const result = yield *breakIfLeft(value);

				type _CheckResolved = DCommon.ExpectType<typeof result, 42, "strict">;

				resumed(result);
				yield *commit("notify", result);
				return result;
			} finally {
				cleanup();
			}
		});
		const result = DInvocation.consumeWorkflow(workflow(input), { "commit/notify": notify });

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<42 | typeof breakFailure>, "strict">;

		await expect(result).resolves.toBe(expected);
		expect(resumed.mock.calls).toStrictEqual(expectedCalls);
		expect(notify.mock.calls).toStrictEqual(expectedCalls);
		expect(cleanup).toHaveBeenCalledOnce();
	});
});
