import { FlowControllerExit, FlowController } from '../base';
import type * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
import * as DEither from '../../../../either';
export declare const flowControllerExclusiveKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-exclusive", unknown>>;
export interface FlowControllerExclusive<GenericInput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, FlowControllerExit<DEither.Left<"exclusive-reject">>> & DKind.Kind<typeof flowControllerExclusiveKind>> {
}
export declare const exclusive: <GenericInput extends unknown>() => FlowControllerExclusive<GenericInput>;
