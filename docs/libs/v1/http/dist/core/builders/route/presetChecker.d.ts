import { Floor } from '../../types';
import { RouteDefinition } from '../../route';
import { PresetCheckerStep } from '../../steps';
import { GetPresetCheckerIndex, GetPresetCheckerInformation, GetPresetCheckerResult, GetPresetCheckerInput, PresetChecker } from '../../presetChecker';
import { Metadata } from '../../metadata';
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DArray from "@duplojs-v1/lang/array";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        presetCheck<GenericPresetChecker extends PresetChecker, GenericInput extends GetPresetCheckerInput<GenericPresetChecker>, const GenericMetadata extends readonly Metadata[] = readonly []>(presetChecker: GenericPresetChecker, input: (floor: GenericFloor) => GenericInput, ...metadata: GenericMetadata): RouteBuilder<DObject.Assign<GenericDefinition, {
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
