import { FlowControllerExit, FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
import * as DEither from '../../../../either';
export declare const flowControllerThrottlingKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-throttling", unknown>>;
export interface FlowControllerThrottling<GenericInput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, Promise<FlowControllerExit<DEither.Left<"throttling-reject">>>> & DKind.Kind<typeof flowControllerThrottlingKind>> {
}
export declare const throttling: <GenericInput extends unknown = unknown>(throttling: DCommon.TimeInString) => FlowControllerThrottling<GenericInput>;
