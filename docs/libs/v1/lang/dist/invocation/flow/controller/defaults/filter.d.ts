import { FlowControllerExit, FlowController } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
import * as DEither from '../../../../either';
export declare const flowControllerFilterKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/flow-controller-filter", unknown>>;
export interface FlowControllerFilter<GenericInput extends unknown = unknown, GenericOutput extends unknown = unknown> extends DCommon.Forward<FlowController<GenericInput, DCommon.SplitPromise<GenericOutput> extends infer InferredOutput ? InferredOutput extends unknown ? Awaited<InferredOutput> extends infer InferredAwaited ? (InferredAwaited extends DEither.Left ? FlowControllerExit<InferredAwaited> : InferredAwaited extends DEither.Right ? DEither.GetValue<InferredAwaited> : InferredAwaited) extends infer InferredResult ? InferredOutput extends Promise<unknown> ? Promise<InferredResult> : InferredResult : never : never : never : never> & DKind.Kind<typeof flowControllerFilterKind>> {
}
export declare const filter: <GenericInput extends unknown, GenericOutput extends unknown>(filterFunction: (input: GenericInput) => GenericOutput) => FlowControllerFilter<GenericInput, GenericOutput>;
