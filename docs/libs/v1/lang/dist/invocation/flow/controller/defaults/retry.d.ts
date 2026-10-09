import { FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
export declare const flowControllerRetryKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-retry", unknown>>;
export interface FlowControllerRetry<GenericInput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, Promise<never>> & DKind.Kind<typeof flowControllerRetryKind>> {
}
export interface RetryParams {
    times?: number;
    timeout?: DCommon.TimeInString;
}
export declare const retry: <GenericInput extends unknown = unknown>({ timeout, times, }: RetryParams) => FlowControllerRetry<GenericInput>;
