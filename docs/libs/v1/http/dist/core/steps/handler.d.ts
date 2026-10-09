import { StepKind } from './kind';
import { Floor } from '../types';
import { ServerSentEventsPredictedResponse, PredictedResponse, ResponseContract, PredictedResponses, StreamPredictedResponse, StreamTextPredictedResponse } from '../response';
import { StepFunctionParams } from './types';
import { Metadata } from '../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export interface HandlerStepFunctionParamsServerSentEventsResponse<GenericResponse extends ServerSentEventsPredictedResponse> {
    serverSentEventsResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startSendingEvents: GenericFilteredResponse["startSendingEvents"]): GenericFilteredResponse;
}
interface HandlerStepFunctionParamsStreamResponse<GenericResponse extends StreamPredictedResponse> {
    streamResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startStream: GenericFilteredResponse["startStream"]): GenericFilteredResponse;
}
interface HandlerStepFunctionParamsStreamTextResponse<GenericResponse extends StreamTextPredictedResponse> {
    streamTextResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startStream: GenericFilteredResponse["startStream"]): GenericFilteredResponse;
}
export interface HandlerStepFunctionParams<GenericResponse extends PredictedResponses = PredictedResponses> extends StepFunctionParams<Extract<GenericResponse, PredictedResponse>>, HandlerStepFunctionParamsServerSentEventsResponse<Extract<GenericResponse, ServerSentEventsPredictedResponse>>, HandlerStepFunctionParamsStreamResponse<Extract<GenericResponse, StreamPredictedResponse>>, HandlerStepFunctionParamsStreamTextResponse<Extract<GenericResponse, StreamTextPredictedResponse>> {
}
export interface HandlerStepDefinition {
    theFunction(floor: Floor, params: HandlerStepFunctionParams): DCommon.MaybePromise<PredictedResponses>;
    readonly responseContract: DCommon.MaybeArray<ResponseContract.Contracts>;
    readonly metadata: readonly Metadata[];
}
export declare const handlerStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/handler-step", unknown>>;
export interface HandlerStep<GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition> extends DCommon.Forward<DKind.Kind<typeof handlerStepKind> & StepKind> {
    definition: GenericDefinition;
}
export declare function createHandlerStep<GenericDefinition extends HandlerStepDefinition>(definition: GenericDefinition): HandlerStep<GenericDefinition>;
export {};
