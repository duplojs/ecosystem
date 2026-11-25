import { WorkflowEffect } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
export declare const workflowEffectResolveKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/workflow-effect-resolve", {
    readonly input: unknown[];
    readonly output: unknown;
}>>;
export interface WorkflowEffectResolve<GenericName extends string = string, GenericInput extends unknown[] = unknown[], GenericOutput extends unknown = unknown> extends DCommon.Forward<DKind.Kind<typeof workflowEffectResolveKind, {
    readonly input: GenericInput;
    readonly output: GenericOutput;
}> & WorkflowEffect<`resolve/${GenericName}`>> {
    readonly input: GenericInput;
}
export interface WorkflowResolveGenerator<GenericName extends string = string, GenericInput extends unknown[] = unknown[], GenericOutput extends unknown = unknown> extends Generator<WorkflowEffectResolve<GenericName, GenericInput, GenericOutput>, GenericOutput> {
    expect<GenericExpectOutput extends GenericOutput>(): Generator<WorkflowEffectResolve<GenericName, GenericInput, GenericExpectOutput>, GenericExpectOutput>;
}
export declare function workflowResolveGenerator<GenericName extends string, const GenericInput extends unknown[], GenericOutput extends unknown>(name: GenericName, ...args: GenericInput): WorkflowResolveGenerator<GenericName, GenericInput, GenericOutput>;
