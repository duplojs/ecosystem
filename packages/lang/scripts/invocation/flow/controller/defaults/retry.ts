import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerPreviousFunctionResult, type FlowController } from "../base";

export const flowControllerRetryKind = createKind("flow-controller-retry");

export interface FlowControllerRetry<
	GenericInput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<GenericInput, Promise<never>>
	& DKind.Kind<typeof flowControllerRetryKind>
	> {

}

export interface RetryParams {
	times?: number;
	timeout?: DCommon.TimeInString;
}

export const retry = createFlowController(
	flowControllerRetryKind,
	({ init }) => <
		GenericInput extends unknown = unknown,
	>(
		{
			timeout,
			times,
		}: RetryParams,
	) => {
		const formattedTimeout = timeout && DCommon.stringToMillisecond(timeout);
		const maxTimes = times ?? Infinity;

		return init<FlowControllerRetry<GenericInput>>(
			async(
				previousFunction,
			) => {
				let result: FlowControllerPreviousFunctionResult | undefined = undefined;

				let count = 0;
				do {
					if (formattedTimeout && count !== 0) {
						await DCommon.timeout(formattedTimeout);
					}

					result = await previousFunction();

					count++;
				} while (
					DEither.isLeft(result)
					&& count < maxTimes
				);

				return result;
			},
		);
	},
);
