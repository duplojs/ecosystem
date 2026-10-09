import { FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
export declare const flowControllerTimeoutKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-timeout", unknown>>;
export interface FlowControllerTimeout<GenericInput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, Promise<never>> & DKind.Kind<typeof flowControllerTimeoutKind>> {
}
export declare const timeout: <GenericInput extends unknown = unknown>(timeout: DCommon.TimeInString) => FlowControllerTimeout<GenericInput>;
