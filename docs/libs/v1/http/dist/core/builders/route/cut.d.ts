import { Floor } from '../../types';
import { ResponseContract } from '../../response';
import { RouteDefinition } from '../../route';
import { CutStepFunctionOutput, CutStep, CutStepFunctionParams, cutStepOutputKind } from '../../steps';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DArray from "@duplojs-v1/lang/array";
import type * as DKind from "@duplojs-v1/lang/kind";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        cut<const GenericResponseContract extends (ResponseContract.Contract | readonly ResponseContract.Contract[]), GenericResponse extends ResponseContract.Convert<DArray.Coalescing<GenericResponseContract>[number]>, GenericOutput extends CutStepFunctionOutput | GenericResponse, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, params: CutStepFunctionParams<GenericResponse>) => DCommon.MaybePromise<GenericOutput>, ...metadata: GenericMetadata): RouteBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CutStep<{
                    readonly responseContract: GenericResponseContract;
                    theFunction(floor: GenericFloor, param: CutStepFunctionParams<GenericResponse>): DCommon.MaybePromise<GenericOutput>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DCommon.IsEqual<Extract<GenericOutput, CutStepFunctionOutput>, never> extends true ? GenericFloor : (GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput ? DObject.Assign<GenericFloor, DKind.GetValue<typeof cutStepOutputKind, InferredOutputData>> : never)>;
    }
}
