import { Evidence } from '../../evidence';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import type * as DEither from '../../../either';
export declare const flowControllerExitKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-exit", unknown>>;
export interface FlowControllerExit<GenericResult extends unknown = unknown> extends DKind.Kind<typeof flowControllerExitKind, GenericResult> {
}
export declare const flowControllerKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller", unknown>>;
declare const FlowControllerResultSymbol: unique symbol;
export type FlowControllerPreviousFunctionResult = DCommon.MaybePromise<(DCommon.AnyValue | DEither.Right | DEither.Left | FlowControllerExit) & Evidence<"PreviousFunctionResult">>;
export interface FlowControllerResult<GenericResult extends unknown> {
    readonly [FlowControllerResultSymbol]: GenericResult;
}
export type UnwrapFlowControllerResult<GenericValue extends unknown> = GenericValue extends FlowControllerResult<infer InferredResult> ? InferredResult : GenericValue;
export interface FlowController<GenericInput extends unknown = unknown, GenericOutput extends unknown = unknown> extends DKind.Kind<typeof flowControllerKind> {
    (this: never, input: GenericInput): FlowControllerResult<GenericOutput>;
    exec(previousFunction: () => FlowControllerPreviousFunctionResult): (FlowControllerPreviousFunctionResult | GenericOutput | DCommon.MergePromise<FlowControllerPreviousFunctionResult | GenericOutput>);
}
export interface CreateFlowControllerConstructorParams<GenericKindHandler extends DKind.Handler = DKind.Handler> {
    init<GenericFlowController extends (FlowController<any, any> & DKind.Kind<GenericKindHandler>)>(exec: GenericFlowController["exec"]): GenericFlowController;
    exitFlow<GenericValue extends unknown>(value: GenericValue): FlowControllerExit<GenericValue>;
}
export declare function createFlowController<GenericKindHandler extends DKind.Handler, GenericConstructor extends ((...args: any[]) => (FlowController<any, any> & DKind.Kind<GenericKindHandler>))>(kindHandler: GenericKindHandler, createConstructor: (params: CreateFlowControllerConstructorParams<GenericKindHandler>) => GenericConstructor): GenericConstructor;
export {};
