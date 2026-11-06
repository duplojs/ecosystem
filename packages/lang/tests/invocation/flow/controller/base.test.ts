import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";
import type * as DKind from "@scripts/kind";

describe("createFlowController", () => {
	it("should create a controller that can exit the flow", async() => {
		const testFlowControllerKind = DInvocation.createKind("test-flow-controller");
		type TestFlowController = DCommon.UnionToIntersection<
			& DInvocation.FlowController<
				number,
				DInvocation.FlowControllerExit<
					DEither.Left<"stopped">
				>
			>
			& DKind.Kind<typeof testFlowControllerKind>
		>;

		const stopFlow = DInvocation.createFlowController(
			testFlowControllerKind,
			({ exitFlow, init }) => () => init<TestFlowController>(
				() => exitFlow(DEither.left("stopped", undefined)),
			),
		);
		const useFlow = DInvocation.flow(
			(input: number) => input + 1,
			stopFlow(),
			(input) => `value-${input}`,
		);
		const result = useFlow(41);

		expect(DInvocation.flowControllerKind.has(stopFlow())).toBe(true);
		expect(testFlowControllerKind.has(stopFlow())).toBe(true);
		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toStrictEqual(DEither.left("stopped", undefined));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<DEither.Left<"stopped"> | `value-${number}`>,
			"strict"
		>;
	});

	it("should pass the previous function and hooks to a custom controller", async() => {
		const testFlowControllerKind = DInvocation.createKind("test-flow-controller-without-argument");
		type TestFlowController = (
			& DInvocation.FlowController<number, string>
			& DKind.Kind<typeof testFlowControllerKind>
		);
		const exec = vi.fn<TestFlowController["exec"]>((previousFunction) => {
			expect(previousFunction()).toBe(42);

			return "controlled";
		});
		const controller = DInvocation.createFlowController(
			testFlowControllerKind,
			({ init }) => () => init<TestFlowController>(exec),
		);
		const useFlow = DInvocation.flow(
			(input: number) => input + 1,
			controller(),
			(input) => {
				type _CheckInput = DCommon.ExpectType<typeof input, string, "strict">;

				return `value-${input}` as const;
			},
		);
		const result = useFlow(41);

		await expect(result).resolves.toBe("value-controlled");
		expect(exec).toHaveBeenCalledExactlyOnceWith(expect.any(Function), {
			onFlowEnd: expect.any(Function),
		});

		type _CheckControllerParameters = DCommon.ExpectType<
			Parameters<TestFlowController>,
			[input: number],
			"strict"
		>;
		type _CheckExecParameters = DCommon.ExpectType<
			Parameters<TestFlowController["exec"]>,
			[
				previousFunction: () => DInvocation.FlowControllerPreviousFunctionResult,
				hooks: DInvocation.FlowControllerHooks,
			],
			"strict"
		>;

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<`value-${string}`>,
			"strict"
		>;
	});

	it("returns a promise when a controller bypasses asynchronous previous steps", async() => {
		const controllerKind = DInvocation.createKind("test-bypass-async-previous");
		const controller = DInvocation.createFlowController(
			controllerKind,
			({ init }) => () => init<
				& DInvocation.FlowController<number, string>
				& DKind.Kind<typeof controllerKind>
			>(() => "controlled"),
		);
		const previous = vi.fn((input: number) => Promise.resolve(input + 1));
		const useFlow = DInvocation.flow(previous, controller());
		const result = useFlow(1);

		expect(previous).not.toHaveBeenCalled();
		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toBe("controlled");

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;
	});
});
