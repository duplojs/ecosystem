import { type DCommon, DEither, DInvocation, type DKind, type ExpectType } from "@scripts";

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
				() => exitFlow(DEither.left("stopped")),
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
		expect(result).toStrictEqual(DEither.left("stopped"));

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Left<"stopped">
			| `value-${number}`,
			"strict"
		>;
	});
});
