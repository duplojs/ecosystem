import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, type FlowController, flowControllerExitKind } from "../base";

export const flowControllerFilterKind = createKind("flow-controller-filter");

export interface FlowControllerFilter<
	GenericInput extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<
		GenericInput,
		DCommon.SplitPromise<GenericOutput> extends infer InferredOutput
			? InferredOutput extends unknown
				? Awaited<InferredOutput> extends infer InferredAwaited
					? (
						InferredAwaited extends DEither.Left
							? FlowControllerExit<InferredAwaited>
							: InferredAwaited extends DEither.Right
								? DEither.GetValue<InferredAwaited>
								: InferredAwaited
					) extends infer InferredResult
						? InferredOutput extends Promise<unknown>
							? Promise<InferredResult>
							: InferredResult
						: never
					: never
				: never
			: never
	>
	& DKind.Kind<typeof flowControllerFilterKind>
	> {

}

export const filter = createFlowController(
	flowControllerFilterKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown,
		GenericOutput extends unknown,
	>(
		filterFunction: (
			input: GenericInput,
		) => GenericOutput,
	): FlowControllerFilter<
		GenericInput,
		GenericOutput
	> => init<FlowControllerFilter>(
		(
			previousFunction,
		) => DCommon.callThen(
			previousFunction(),
			(result) => {
				if (flowControllerExitKind.has(result)) {
					return result;
				}

				return DCommon.callThen(
					filterFunction(result as never),
					(filterResult) => {
						const result = DEither.unwrapRight(filterResult);

						if (DEither.isLeft(result)) {
							return exitFlow(result);
						}

						return result;
					},
				);
			},
		),
	) as never,
);
