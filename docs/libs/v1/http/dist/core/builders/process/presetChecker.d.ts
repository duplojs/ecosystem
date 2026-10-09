import { Floor } from '../../types';
import { PresetCheckerStep } from '../../steps';
import { GetPresetCheckerIndex, GetPresetCheckerInformation, GetPresetCheckerResult, GetPresetCheckerInput, PresetChecker } from '../../presetChecker';
import { ProcessDefinition } from '../../process';
import { Metadata } from '../../metadata';
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DArray from "@duplojs-v1/lang/array";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        presetCheck<GenericPresetChecker extends PresetChecker, GenericInput extends GetPresetCheckerInput<GenericPresetChecker>, const GenericMetadata extends readonly Metadata[] = readonly []>(presetChecker: GenericPresetChecker, input: (floor: GenericFloor) => GenericInput, ...metadata: GenericMetadata): ProcessBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                PresetCheckerStep<{
                    readonly presetChecker: GenericPresetChecker;
                    input(floor: GenericFloor): GenericInput;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DObject.Assign<GenericFloor, {
            [Prop in GetPresetCheckerIndex<GenericPresetChecker>]: Extract<Awaited<GetPresetCheckerResult<GenericPresetChecker>>, {
                information: DArray.Coalescing<GetPresetCheckerInformation<GenericPresetChecker>>[number];
            }>["value"];
        }>>;
    }
}
