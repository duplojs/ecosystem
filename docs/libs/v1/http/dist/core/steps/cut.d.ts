import { StepKind } from './kind';
import { Floor } from '../types';
import { StepFunctionParams } from './types';
import { PredictedResponse, ResponseContract } from '../response';
import { Metadata } from '../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export declare const cutStepOutputKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/cut-output", unknown>>;
export interface CutStepFunctionOutput<GenericData extends Record<string, unknown> = Record<string, unknown>> extends DKind.Kind<typeof cutStepOutputKind, GenericData> {
}
export interface CutStepFunctionParams<GenericResponse extends PredictedResponse = PredictedResponse> extends StepFunctionParams<GenericResponse> {
    output<GenericData extends Record<string, unknown> = never>(data?: GenericData): CutStepFunctionOutput<DCommon.NeverCoalescing<GenericData, {}>>;
}
export interface CutStepDefinition {
    theFunction(floor: Floor, params: CutStepFunctionParams): DCommon.MaybePromise<CutStepFunctionOutput | PredictedResponse>;
    readonly responseContract: DCommon.MaybeArray<ResponseContract.Contract>;
    readonly metadata: readonly Metadata[];
}
export declare const cutStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/cut-step", unknown>>;
export interface CutStep<GenericDefinition extends CutStepDefinition = CutStepDefinition> extends DCommon.Forward<DKind.Kind<typeof cutStepKind> & StepKind> {
    definition: GenericDefinition;
}
export declare function createCutStep<GenericDefinition extends CutStepDefinition>(definition: GenericDefinition): CutStep<GenericDefinition>;
