import { Effect, workflowBreakIfLeftGenerator, WorkflowEffectBreakIfLeft, workflowEffectBreakIfLeftKind, workflowCommitGenerator, WorkflowEffectCommit, workflowEffectCommitKind, workflowEffectKind, WorkflowEffectResolve, workflowEffectResolveKind, workflowResolveGenerator, workflowIterateGenerator, WorkflowEffectIterate } from './effects';
import { RequireWorkflowEffects } from './types';
import * as DCommon from '../../common';
import * as DGenerator from '../../generator';
import type * as DKind from '../../kind';
import type * as DObject from '../../object';
import * as DEither from '../../either';
export interface CreateWorkflowInitParams {
    iterate: typeof workflowIterateGenerator;
    resolve: typeof workflowResolveGenerator;
    commit: typeof workflowCommitGenerator;
    breakIfLeft: typeof workflowBreakIfLeftGenerator;
}
export declare const createWorkflowInitParams: CreateWorkflowInitParams;
export declare function createWorkflow<GenericWorkflow extends DCommon.AnyFunction<any[], Generator<any>>>(init: (((params: CreateWorkflowInitParams) => GenericWorkflow) & RequireWorkflowEffects<NoInfer<GenericWorkflow>>)): GenericWorkflow;
type NestedWorkflowEffects<GenericEffect extends Effect> = Effect extends GenericEffect ? GenericEffect : GenericEffect extends WorkflowEffectIterate ? GenericEffect | NestedWorkflowEffects<DGenerator.GetItem<ReturnType<GenericEffect["iteratorFunction"]>>> : GenericEffect;
type ImplementedEffect = WorkflowEffectCommit | WorkflowEffectResolve | WorkflowEffectIterate;
type IterateItem<GenericEffect extends WorkflowEffectIterate> = Parameters<GenericEffect["iteratorFunction"]> extends [] ? unknown : Parameters<GenericEffect["iteratorFunction"]>[0];
type IterateIterable<GenericEffect extends WorkflowEffectIterate> = (Iterable<IterateItem<GenericEffect>> | AsyncIterable<IterateItem<GenericEffect>>);
type IterateGetter<GenericEffect extends WorkflowEffectIterate> = (...args: GenericEffect["input"]) => DCommon.MaybePromise<IterateIterable<GenericEffect> | DEither.Left | DEither.Right<string, IterateIterable<GenericEffect>>>;
export interface WorkflowIterateOptions<GenericGetter extends DCommon.AnyFunction = DCommon.AnyFunction> {
    readonly getIterator: GenericGetter;
    readonly concurrency: number;
}
type EffectImplementationFunction<GenericImplementation extends unknown> = GenericImplementation extends DCommon.AnyFunction ? GenericImplementation : GenericImplementation extends WorkflowIterateOptions ? GenericImplementation["getIterator"] : never;
type EffectsImplementation<GenericEffect extends Effect> = Extract<{
    [WorkflowEffect in Extract<NestedWorkflowEffects<GenericEffect>, ImplementedEffect> as DKind.GetValue<typeof workflowEffectKind, WorkflowEffect>]: WorkflowEffect extends WorkflowEffectCommit ? DKind.GetValue<typeof workflowEffectCommitKind, WorkflowEffect> : WorkflowEffect extends WorkflowEffectResolve ? (...args: DKind.GetValue<typeof workflowEffectResolveKind, WorkflowEffect>["input"]) => DCommon.MaybePromise<DEither.Left | DEither.Right<string, DKind.GetValue<typeof workflowEffectResolveKind, WorkflowEffect>["output"]>> : WorkflowEffect extends WorkflowEffectIterate ? IterateGetter<WorkflowEffect> | WorkflowIterateOptions<IterateGetter<WorkflowEffect>> : never;
}, Record<string, DCommon.AnyFunction | WorkflowIterateOptions>>;
type ForbiddenMoreKey<GenericEffect extends Effect, GenericEffects extends EffectsImplementation<GenericEffect>> = DObject.ForbiddenKey<GenericEffects, Extract<Exclude<keyof GenericEffects, DKind.GetValue<typeof workflowEffectKind, Extract<NestedWorkflowEffects<GenericEffect>, ImplementedEffect>>>, string | number>>;
type ComputeOutputConsumeWorkflow<GenericGenerator extends Generator<Effect>, GenericEffects extends EffectsImplementation<DGenerator.GetItem<GenericGenerator>>> = Extract<Promise<Awaited<DGenerator.GetResult<GenericGenerator>> | Extract<DKind.GetValue<typeof workflowEffectBreakIfLeftKind, Extract<NestedWorkflowEffects<DGenerator.GetItem<GenericGenerator>>, WorkflowEffectBreakIfLeft>>, DEither.Left> | Extract<Awaited<DGenerator.GetResult<ReturnType<Extract<NestedWorkflowEffects<DGenerator.GetItem<GenericGenerator>>, WorkflowEffectIterate>["iteratorFunction"]>>>, DEither.Left> | Extract<Awaited<ReturnType<EffectImplementationFunction<GenericEffects[keyof GenericEffects]>>>, DEither.Left>>, any>;
export declare function consumeWorkflow<GenericGenerator extends Generator<Effect>, GenericEffects extends EffectsImplementation<DGenerator.GetItem<GenericGenerator>>>(generator: GenericGenerator, effects: (DCommon.FixDeepFunctionInfer<EffectsImplementation<DGenerator.GetItem<GenericGenerator>>, GenericEffects> & ForbiddenMoreKey<DGenerator.GetItem<NoInfer<GenericGenerator>>, GenericEffects>)): ComputeOutputConsumeWorkflow<GenericGenerator, GenericEffects>;
export {};
