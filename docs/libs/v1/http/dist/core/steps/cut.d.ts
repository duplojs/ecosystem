import { StepKind } from './kind';
import { Floor } from '../types';
import { PredictedResponse } from '../response';
import { Metadata } from '../metadata';
import { Request } from '../request';
import { ResponseHelper } from '../response/helpers';
import * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export declare const cutStepOutputKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/cut-output", unknown>>;
export interface CutStepFunctionOutput<GenericData extends Record<string, unknown> = Record<string, unknown>> extends DKind.Kind<typeof cutStepOutputKind, GenericData> {
}
export interface CutStepFunctionParams {
    readonly request: Request;
    readonly response: ResponseHelper.Methods400;
    output<GenericData extends Record<string, unknown> = never>(data?: GenericData): CutStepFunctionOutput<DCommon.NeverCoalescing<GenericData, {}>>;
}
export interface CutStepDefinition {
    theFunction(floor: Floor, params: CutStepFunctionParams): DCommon.MaybePromise<CutStepFunctionOutput | PredictedResponse>;
    readonly metadata: readonly Metadata[];
}
export declare const cutStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/cut-step", unknown>>;
export interface CutStep<GenericDefinition extends CutStepDefinition = CutStepDefinition> extends DCommon.Forward<DKind.Kind<typeof cutStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createCutStep<GenericDefinition extends CutStepDefinition>(definition: GenericDefinition): CutStep<GenericDefinition>;
