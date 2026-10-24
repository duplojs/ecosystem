import type * as DCommon from "@duplojs/lang/common";
import { type PromiseRequestParams } from "./promiseRequestParams";
import { type RouteContractResponseDefault, type RouteContract, type RouteContractResponse, type RouteContractResponseFlux, type RouteContractResponseSSE, type RouteContractResponseStream } from "@core";
import { type RouteContractToClientRequestParams } from "./clientRequestParams";

export type ClientResponseBody = unknown;

export interface ClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
	code: `${number}`;
	information: undefined | string;
	body: ClientResponseBody;
	ok: boolean | null;
	headers: Headers;
	type: ResponseType;
	url: string;
	redirected: boolean;
	raw: globalThis.Response;
	requestParams: PromiseRequestParams<GenericHookParams>;
	predicted: boolean;
	fromCache?: boolean;
}

export interface ClientResponseHandler<
	GenericType extends string,
> {
	handlerType: GenericType;
}

export interface ClientStreamResponseHandler<
	GenericFlux extends RouteContractResponseFlux = RouteContractResponseFlux,
> extends AsyncIterable<GenericFlux, void>, ClientResponseHandler<"stream"> {
	closeStream(): void;
	onStream(event: "close", callback: (response: this) => DCommon.MaybePromise<void>): this;
	onStream(event: "error", callback: (error: unknown, response: this) => DCommon.MaybePromise<void>): this;
	onStream(event: "start", callback: (response: this) => DCommon.MaybePromise<void>): this;
	onStream(event: "receiveData", callback: (data: GenericFlux, response: this) => DCommon.MaybePromise<void>): this;
	consumeStream(): Promise<void>;
}

export interface ClientStreamResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams>, ClientStreamResponseHandler {

}

export interface ServerEvent {
	data: unknown;
	event: string;
	id?: string;
	retry?: number;
}

export interface ClientEventsResponseHandler<
	GenericServerEvent extends ServerEvent = ServerEvent,
> extends AsyncIterable<GenericServerEvent, void>, ClientResponseHandler<"events"> {
	closeEventStream(): void;
	onReceiveEvent<
		GenericEventName extends GenericServerEvent["event"],
	>(
		name: GenericEventName,
		callback: (
			event: DCommon.NeverCoalescing<
				Extract<GenericServerEvent, { event: GenericEventName }>,
				ServerEvent
			>,
			response: this,
		) => DCommon.MaybePromise<void>
	): this;
	onStreamEvent(event: "close", callback: (response: this) => DCommon.MaybePromise<void>): this;
	onStreamEvent(event: "beforeRetry", callback: (response: this) => DCommon.MaybePromise<void>): this;
	onStreamEvent(event: "error", callback: (error: unknown, response: this) => DCommon.MaybePromise<void>): this;
	onStreamEvent(event: "start", callback: (response: this) => DCommon.MaybePromise<void>): this;
	onStreamEvent(event: "receiveServerEvents", callback: (event: GenericServerEvent, response: this) => DCommon.MaybePromise<void>): this;
	consumeEventStream(): Promise<void>;
}

export interface ClientEventsResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams>, ClientEventsResponseHandler {

}

export type AllClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = (
	| ClientResponse<GenericHookParams>
	| ClientStreamResponse<GenericHookParams>
	| ClientEventsResponse<GenericHookParams>
);

export interface NotPredictedClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams> {
	predicted: false;
}

export interface NotPredictedClientStreamResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends NotPredictedClientResponse<GenericHookParams>, ClientStreamResponseHandler {

}

export interface NotPredictedClientEventsResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends NotPredictedClientResponse<GenericHookParams>, ClientEventsResponseHandler {

}

export type AllNotPredictedClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = (
	| NotPredictedClientResponse<GenericHookParams>
	| NotPredictedClientStreamResponse<GenericHookParams>
	| NotPredictedClientEventsResponse<GenericHookParams>
);

export type RouteContractToClientResponse<
	GenericRouteContract extends RouteContract = RouteContract,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = GenericRouteContract extends any
	? GenericRouteContract["responses"] extends infer InferredResponse
		? InferredResponse extends RouteContractResponse
			? (
				DCommon.SimplifyTopLevel<{
					code: InferredResponse["code"];
					information: InferredResponse["information"];
					body: InferredResponse extends RouteContractResponseDefault
						? DCommon.IsEqual<InferredResponse["body"], File> extends true
							? undefined
							: DCommon.ToJson<InferredResponse["body"]>
						: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: DCommon.SimplifyTopLevel<
						& RouteContractToClientRequestParams<
							GenericRouteContract,
							GenericHookParams
						>
						& PromiseRequestParams<GenericHookParams>
					>;
					predicted: boolean;
					fromCache?: boolean;
				}>
				& (
					InferredResponse extends RouteContractResponseSSE
						? ClientEventsResponseHandler<
							{
								[EventName in keyof InferredResponse["events"]]: EventName extends string
									? {
										event: EventName;
										data: DCommon.ToJson<InferredResponse["events"][EventName]>;
										id?: string;
										retry?: number;
									}
									: never
							}[keyof InferredResponse["events"]]
						>
						: unknown
				)
				& (
					InferredResponse extends RouteContractResponseStream
						? ClientStreamResponseHandler<InferredResponse["flux"]>
						: unknown
				)
			) extends infer InferredResult extends ClientResponse
				? InferredResult
				: never
			: never
		: never
	: never;
