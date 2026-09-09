import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../../kind";
import { createFlowController, flowControllerExitKind, type FlowController } from "../base";

export const flowControllerTimeoutKind = createKind("flow-controller-timeout");

export interface FlowControllerTimeout<
	GenericInput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<GenericInput, Promise<never>>
	& DKind.Kind<typeof flowControllerTimeoutKind>
	> {

}

export const timeout = createFlowController(
	flowControllerTimeoutKind,
	({ init }) => <
		GenericInput extends unknown = unknown,
	>(
		timeout: DCommon.TimeInString,
	) => {
		const formattedTimeout = DCommon.stringToMillisecond(timeout);

		return init<FlowControllerTimeout<GenericInput>>(
			async(
				previousFunction,
			) => {
				const result = await previousFunction();
				if (flowControllerExitKind.has(result)) {
					return result;
				}

				await DCommon.timeout(formattedTimeout);

				return result;
			},
		);
	},
);
