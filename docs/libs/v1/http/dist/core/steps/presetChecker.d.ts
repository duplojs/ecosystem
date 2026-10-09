import { StepKind } from './kind';
import { Floor } from '../types';
import { PresetChecker } from '../presetChecker';
import { Metadata } from '../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export interface PresetCheckerStepDefinition {
    readonly presetChecker: PresetChecker;
    input(input: Floor): unknown;
    readonly metadata: readonly Metadata[];
}
export declare const presetCheckerStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/presetChecker-step", unknown>>;
export interface PresetCheckerStep<GenericDefinition extends PresetCheckerStepDefinition = PresetCheckerStepDefinition> extends DCommon.Forward<DKind.Kind<typeof presetCheckerStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createPresetCheckerStep<GenericDefinition extends PresetCheckerStepDefinition>(definition: GenericDefinition): PresetCheckerStep<GenericDefinition>;
