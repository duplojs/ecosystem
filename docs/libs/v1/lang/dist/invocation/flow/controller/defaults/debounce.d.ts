import { FlowControllerExit, FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
import * as DEither from '../../../../either';
export declare const flowControllerDebounceKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-debounce", unknown>>;
export interface FlowControllerDebounce<GenericInput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, Promise<FlowControllerExit<DEither.Left<"debounce-reject">>>> & DKind.Kind<typeof flowControllerDebounceKind>> {
}
export declare const debounce: <GenericInput extends unknown = unknown>(debounce: DCommon.TimeInString) => FlowControllerDebounce<GenericInput>;
