import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, flowControllerExitKind, type FlowController } from "../base";

export const flowControllerDebounceKind = createKind("flow-controller-debounce");

export interface FlowControllerDebounce<
	GenericInput extends unknown = unknown,
> extends DCommon.Forward<
	& FlowController<
		GenericInput,
		Promise<
			FlowControllerExit<
				DEither.Left<"debounce-reject">
			>
		>
	>
	& DKind.Kind<typeof flowControllerDebounceKind>
	> {

}

export const debounce = createFlowController(
	flowControllerDebounceKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown = unknown,
	>(
		debounce: DCommon.TimeInString,
	) => {
		const formattedDebounceTime = DCommon.stringToMillisecond(debounce);
		let lastTimeout: unknown = undefined;
		let lastEvent: undefined | DCommon.ExternalPromise<boolean> = undefined;

		return init<FlowControllerDebounce<GenericInput>>(
			async(
				previousFunction,
			) => {
				const result = await previousFunction();
				if (flowControllerExitKind.has(result)) {
					return result;
				}

				clearTimeout(lastTimeout as never);
				lastEvent?.resolve(false);
				lastEvent = DCommon.createExternalPromise();
				lastTimeout = setTimeout(
					() => lastEvent?.resolve(true),
					formattedDebounceTime,
				);
				const canContinue = await lastEvent.promise;
				if (!canContinue) {
					return exitFlow(DEither.left("debounce-reject"));
				}
				return result;
			},
		);
	},
);
