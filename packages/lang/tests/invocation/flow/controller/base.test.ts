import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";
import type * as DKind from "@scripts/kind";

describe("createFlowController", () => {
	it("should create a controller that can exit the flow", () => {
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
		expect(result).toStrictEqual(DEither.left("stopped", undefined));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"stopped">
			| `value-${number}`,
			"strict"
		>;
	});

	it("should pass only the previous function to a custom controller", () => {
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

		expect(result).toBe("value-controlled");
		expect(exec).toHaveBeenCalledExactlyOnceWith(expect.any(Function));

		type _CheckControllerParameters = DCommon.ExpectType<
			Parameters<TestFlowController>,
			[input: number],
			"strict"
		>;
		type _CheckExecParameters = DCommon.ExpectType<
			Parameters<TestFlowController["exec"]>,
			[previousFunction: () => DInvocation.FlowControllerPreviousFunctionResult],
			"strict"
		>;

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`value-${string}`,
			"strict"
		>;
	});
});
