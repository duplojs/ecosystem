import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/types";
import { type ServerSentEventsPredictedResponse, type PredictedResponse, type ResponseContract, type PredictedResponses, type StreamPredictedResponse, type StreamTextPredictedResponse } from "@core/response";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export interface HandlerStepFunctionParamsServerSentEventsResponse<
	GenericResponse extends ServerSentEventsPredictedResponse,
> {
	serverSentEventsResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startSendingEvents: GenericFilteredResponse["startSendingEvents"],
	): GenericFilteredResponse;
}

interface HandlerStepFunctionParamsStreamResponse<
	GenericResponse extends StreamPredictedResponse,
> {
	streamResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startStream: GenericFilteredResponse["startStream"],
	): GenericFilteredResponse;
}

interface HandlerStepFunctionParamsStreamTextResponse<
	GenericResponse extends StreamTextPredictedResponse,
> {
	streamTextResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startStream: GenericFilteredResponse["startStream"],
	): GenericFilteredResponse;
}

export interface HandlerStepFunctionParams<
	GenericResponse extends PredictedResponses = PredictedResponses,
> extends StepFunctionParams<
		Extract<
			GenericResponse,
			PredictedResponse
		>
	>,
	HandlerStepFunctionParamsServerSentEventsResponse<
		Extract<
			GenericResponse,
			ServerSentEventsPredictedResponse
		>
	>,
	HandlerStepFunctionParamsStreamResponse<
		Extract<
			GenericResponse,
			StreamPredictedResponse
		>
	>,
	HandlerStepFunctionParamsStreamTextResponse<
		Extract<
			GenericResponse,
			StreamTextPredictedResponse
		>
	> {

}

export interface HandlerStepDefinition {
	theFunction(
		floor: Floor,
		params: HandlerStepFunctionParams
	): DCommon.MaybePromise<PredictedResponses>;
	readonly responseContract: DCommon.MaybeArray<ResponseContract.Contracts>;
	readonly metadata: readonly Metadata[];
}

export const handlerStepKind = createKind("handler-step");

export interface HandlerStep<
	GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition,
> extends DCommon.Forward<
		& DKind.Kind<typeof handlerStepKind>
		& StepKind
	> {
	definition: GenericDefinition;
}

export function createHandlerStep<
	GenericDefinition extends HandlerStepDefinition,
>(
	definition: GenericDefinition,
): HandlerStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => handlerStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
