import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, flowControllerExitKind, type FlowController } from "../base";

export const flowControllerThrottlingKind = createKind("flow-controller-throttling");

export interface FlowControllerThrottling<
	GenericInput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<
		GenericInput,
		Promise<
			FlowControllerExit<
				DEither.Left<"throttling-reject">
			>
		>
	>
	& DKind.Kind<typeof flowControllerThrottlingKind>
	> {

}

export const throttling = createFlowController(
	flowControllerThrottlingKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown = unknown,
	>(
		throttling: DCommon.TimeInString,
	) => {
		const formattedThrottlingTime = DCommon.stringToMillisecond(throttling);
		let lastTime = 0;
		let lastEvent: undefined | DCommon.ExternalPromise<boolean> = undefined;

		return init<FlowControllerThrottling<GenericInput>>(
			async(
				previousFunction,
			) => {
				const result = await previousFunction();
				if (flowControllerExitKind.has(result)) {
					return result;
				}

				if (Date.now() - lastTime < formattedThrottlingTime) {
					lastEvent?.resolve(false);
					lastEvent = DCommon.createExternalPromise();

					const canContinue = await lastEvent.promise;
					if (!canContinue) {
						return exitFlow(DEither.left("throttling-reject"));
					}
				}

				setTimeout(
					() => lastEvent?.resolve(true),
					formattedThrottlingTime,
				);
				lastTime = Date.now();
				return result;
			},
		);
	},
);
