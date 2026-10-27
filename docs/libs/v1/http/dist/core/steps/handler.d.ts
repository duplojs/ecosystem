import { StepKind } from './kind';
import { Floor } from '../types';
import { PredictedResponses } from '../response';
import { Metadata } from '../metadata';
import { ResponseHelper } from '../response/helpers';
import { Request } from '../request';
import * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export interface HandlerStepFunctionParams {
    readonly request: Request;
    readonly response: DCommon.SimplifyTopLevel<typeof ResponseHelper>;
}
export interface HandlerStepDefinition {
    theFunction(floor: Floor, params: HandlerStepFunctionParams): DCommon.MaybePromise<PredictedResponses>;
    readonly metadata: readonly Metadata[];
}
export declare const handlerStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/handler-step", unknown>>;
export interface HandlerStep<GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition> extends DCommon.Forward<DKind.Kind<typeof handlerStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createHandlerStep<GenericDefinition extends HandlerStepDefinition>(definition: GenericDefinition): HandlerStep<GenericDefinition>;
