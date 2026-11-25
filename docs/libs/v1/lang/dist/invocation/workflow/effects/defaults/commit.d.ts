import { WorkflowEffect } from '../base';
import * as DCommon from '../../../../common';
import type * as DKind from '../../../../kind';
export declare const workflowEffectCommitKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/workflow-effect-commit", DCommon.AnyFunction<any[], any>>>;
export interface WorkflowEffectCommit<GenericName extends string = string, GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction> extends DCommon.Forward<DKind.Kind<typeof workflowEffectCommitKind, GenericFunction> & WorkflowEffect<`commit/${GenericName}`>> {
    readonly input: Parameters<GenericFunction>;
}
export interface WorkflowCommitGenerator<GenericName extends string = string, GenericInput extends unknown[] = unknown[]> extends Generator<WorkflowEffectCommit<GenericName, (...args: GenericInput) => unknown>, void> {
    withSignature<GenericFunction extends DCommon.AnyFunction<GenericInput>>(): Generator<WorkflowEffectCommit<GenericName, GenericFunction>, void>;
}
export declare function workflowCommitGenerator<GenericName extends string, GenericInput extends unknown[]>(name: GenericName, ...args: GenericInput): WorkflowCommitGenerator<GenericName, GenericInput>;
