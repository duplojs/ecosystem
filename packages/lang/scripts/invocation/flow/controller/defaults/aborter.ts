import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, flowControllerExitKind, type FlowController } from "../base";

export const flowControllerAborterKind = createKind("flow-controller-aborter");

export interface FlowControllerAborter<
	GenericInput extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<
		GenericInput,
		Promise<
			| Awaited<GenericOutput>
			| FlowControllerExit<
				DEither.Left<"signal-aborted", AbortErrorFlowController>
			>
		>
	>
	& DKind.Kind<typeof flowControllerAborterKind>
	> {

}

export class AbortErrorFlowController extends DCommon.DuploJSError.parentClass("invocation-abort-error-flow-controller") {
	public constructor(
		public abortController: AbortController,
	) {
		super("Flow is aborted by FlowControllerAborter.");
	}
}

export interface FlowControllerAborterParams {
	timeout?: DCommon.TimeInString;
}

export const aborter = createFlowController(
	flowControllerAborterKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown,
		GenericOutput extends unknown,
	>(
		theFunction: (
			input: GenericInput,
			aborter: AbortController,
		) => GenericOutput,
		params?: FlowControllerAborterParams,
	): FlowControllerAborter<
		GenericInput,
		GenericOutput
	> => {
		let aborter: AbortController | undefined = undefined;
		const formattedTimeout = params?.timeout === undefined
			? undefined
			: DCommon.stringToMillisecond(params.timeout);

		return init<FlowControllerAborter>(
			async(previousFunction) => {
				const result = previousFunction();
				if (flowControllerExitKind.has(result)) {
					return result;
				}
				aborter?.abort(new AbortErrorFlowController(aborter));
				const currentAborter = new AbortController();
				aborter = currentAborter;
				if (formattedTimeout !== undefined) {
					setTimeout(
						() => void currentAborter.abort(
							new AbortErrorFlowController(currentAborter),
						),
						formattedTimeout,
					);
				}

				try {
					const abortResult = await theFunction(result as never, currentAborter);

					if (currentAborter.signal.aborted === true) {
						return exitFlow(
							DEither.left(
								"signal-aborted",
								currentAborter.signal.reason,
							),
						);
					}
					return abortResult;
				} catch (error) {
					if (error instanceof AbortErrorFlowController) {
						return exitFlow(
							DEither.left(
								"signal-aborted",
								currentAborter.signal.reason,
							),
						);
					}

					throw error;
				}
			},
		) as never;
	},
);
