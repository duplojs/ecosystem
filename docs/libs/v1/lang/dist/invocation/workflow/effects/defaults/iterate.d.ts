import { Effect, WorkflowEffect } from '../base';
import { RequireWorkflowEffects } from '../../types';
import type * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
export declare const workflowEffectIterateKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/workflow-effect-iterate", unknown>>;
export interface WorkflowEffectIterate<GenericName extends string = string, GenericInput extends unknown[] = unknown[], GenericIteratorFunction extends DCommon.AnyFunction<[item: any], Generator<any>> = DCommon.AnyFunction<[item: any], Generator<Effect>>> extends DCommon.Forward<DKind.Kind<typeof workflowEffectIterateKind, GenericInput> & WorkflowEffect<`iterate/${GenericName}`>> {
    readonly input: GenericInput;
    readonly iteratorFunction: GenericIteratorFunction;
}
export declare function workflowIterateGenerator<GenericName extends string, GenericInput extends unknown[]>(name: GenericName, ...args: GenericInput): <GenericIteratorFunction extends DCommon.AnyFunction<[item: any], Generator<any>>>(iteratorFunction: (GenericIteratorFunction & RequireWorkflowEffects<NoInfer<GenericIteratorFunction>>)) => Generator<WorkflowEffectIterate<GenericName, GenericInput, GenericIteratorFunction>, void>;
