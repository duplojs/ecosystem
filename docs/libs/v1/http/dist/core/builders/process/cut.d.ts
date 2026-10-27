import { Floor } from '../../types';
import { PredictedResponse } from '../../response';
import { ProcessDefinition } from '../../process';
import { CutStepFunctionOutput, CutStep, CutStepFunctionParams, cutStepOutputKind } from '../../steps';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DKind from "@duplojs/lang/kind";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        cut<GenericOutput extends (CutStepFunctionOutput | PredictedResponse), const GenericMetadata extends readonly Metadata[] = readonly []>(theFunction: (floor: GenericFloor, params: CutStepFunctionParams) => DCommon.MaybePromise<GenericOutput>, ...metadata: GenericMetadata): ProcessBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CutStep<{
                    theFunction(floor: GenericFloor, param: CutStepFunctionParams): DCommon.MaybePromise<GenericOutput>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DCommon.IsNever<Extract<GenericOutput, CutStepFunctionOutput>> extends true ? GenericFloor : (GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput ? DObject.Assign<GenericFloor, DKind.GetValue<typeof cutStepOutputKind, InferredOutputData>> : never)>;
    }
}
