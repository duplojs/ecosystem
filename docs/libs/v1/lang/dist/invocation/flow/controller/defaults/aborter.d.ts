import { FlowControllerExit, FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
import * as DEither from '../../../../either';
export declare const flowControllerAborterKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-aborter", unknown>>;
export interface FlowControllerAborter<GenericInput extends unknown = unknown, GenericOutput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, Promise<Awaited<GenericOutput> | FlowControllerExit<DEither.Left<"signal-aborted", AbortErrorFlowController>>>> & DKind.Kind<typeof flowControllerAborterKind>> {
}
declare const AbortErrorFlowController_base: abstract new (error: string) => DCommon.DuploJSError<"invocation-abort-error-flow-controller", string> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error-invocation-abort-error-flow-controller", unknown>>, unknown>;
export declare class AbortErrorFlowController extends AbortErrorFlowController_base {
    abortController: AbortController;
    constructor(abortController: AbortController);
}
export interface FlowControllerAborterParams {
    timeout?: DCommon.TimeInString;
}
export declare const aborter: <GenericInput extends unknown, GenericOutput extends unknown>(theFunction: (input: GenericInput, aborter: AbortController) => GenericOutput, params?: FlowControllerAborterParams) => FlowControllerAborter<GenericInput, GenericOutput>;
export {};
