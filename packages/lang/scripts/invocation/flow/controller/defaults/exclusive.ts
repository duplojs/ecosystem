import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, type FlowController } from "../base";

export const flowControllerExclusiveKind = createKind("flow-controller-exclusive");

export interface FlowControllerExclusive<
	GenericInput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<
		GenericInput,
		FlowControllerExit<DEither.Left<"exclusive-reject">>
	>
	& DKind.Kind<typeof flowControllerExclusiveKind>
	> {

}

export const exclusive = createFlowController(
	flowControllerExclusiveKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown,
	>() => {
		let runningExecution: symbol | undefined = undefined;

		return init<FlowControllerExclusive<GenericInput>>(
			(previousFunction, { onFlowEnd, executionReference }) => {
				if (runningExecution === undefined) {
					runningExecution = executionReference;
					onFlowEnd(() => {
						runningExecution = undefined;
					});
					return previousFunction();
				} else if (runningExecution === executionReference) {
					return previousFunction();
				} else {
					return exitFlow(DEither.left("exclusive-reject", undefined));
				}
			},
		);
	},
);
