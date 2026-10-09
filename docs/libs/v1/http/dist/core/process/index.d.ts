import { ProcessStep, CheckerStep, CutStep, ExtractStep, stepKind, PresetCheckerStep } from '../steps';
import { Floor } from '../types/floor';
import { HookRouteLifeCycle } from '../route';
import { Metadata } from '../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DKind from "@duplojs-v1/lang/kind";
export type * from './types';
export interface ProcessStepsCustom {
}
export type ProcessSteps = (ProcessStepsCustom[DObject.GetPropsWithValueExtends<ProcessStepsCustom, DKind.Kind<typeof stepKind>>] | CheckerStep | ExtractStep | PresetCheckerStep | CutStep | ProcessStep);
declare const SymbolProcessExportValue: unique symbol;
export interface ProcessDefinition {
    readonly steps: readonly ProcessSteps[];
    readonly options?: Record<string, unknown>;
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
    [SymbolProcessExportValue]?: Floor;
}
export interface ProcessExportValue<GenericExportValue extends Floor> {
    [SymbolProcessExportValue]: GenericExportValue;
}
export type GetProcessExportValue<GenericProcess extends Process> = DCommon.IsEqual<GenericProcess["definition"][typeof SymbolProcessExportValue], unknown> extends true ? never : GenericProcess["definition"][typeof SymbolProcessExportValue];
export declare const processKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/process", unknown>>;
export interface Process<GenericDefinition extends ProcessDefinition = ProcessDefinition> extends DKind.Kind<typeof processKind> {
    definition: GenericDefinition;
}
export declare function createProcess<GenericDefinition extends Pick<ProcessDefinition, "steps" | "options" | "hooks" | "metadata">>(definition: GenericDefinition): Process<GenericDefinition>;
