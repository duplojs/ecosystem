import { StepKind } from './kind';
import { Process } from '../process';
import { Metadata } from '../metadata';
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DCommon from "@duplojs-v1/lang/common";
export interface ProcessStepDefinition {
    readonly process: Process;
    readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
    readonly imports?: readonly string[];
    readonly metadata: readonly Metadata[];
}
export declare const processStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/process-step", unknown>>;
export interface ProcessStep<GenericDefinition extends ProcessStepDefinition = ProcessStepDefinition> extends DCommon.Forward<DKind.Kind<typeof processStepKind> & StepKind> {
    definition: GenericDefinition;
}
export declare function createProcessStep<GenericDefinition extends ProcessStepDefinition>(definition: GenericDefinition): ProcessStep<GenericDefinition>;
