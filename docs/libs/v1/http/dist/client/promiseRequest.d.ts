import { RequestErrorContent } from './unexpectedResponseError';
import { PromiseRequestParams, Hooks, NotPredictedResponseHook, ErrorHook, ClientEventsResponse, AllClientResponse, AllNotPredictedClientResponse, ClientResponse, ClientEventsResponseHandler, ServerEvent, ClientStreamResponseHandler, ClientStreamResponse, ResponseToEitherByInformation, ResponseToEitherByCode } from './types';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
import * as DEither from "@duplojs-v1/lang/either";
type MaybeResponse<GenericClientResponse extends AllClientResponse = AllClientResponse> = (DEither.Right<"response", GenericClientResponse> | DEither.Left<"request-error", RequestErrorContent>);
type MaybeWantedResponse<GenericWantedClientResponse extends AllClientResponse = AllClientResponse, GenericUnexpectClientResponse extends AllClientResponse = AllClientResponse> = (DEither.Right<"response", GenericWantedClientResponse> | DEither.Left<"unexpect-response", GenericUnexpectClientResponse> | DEither.Left<"request-error", RequestErrorContent>);
type ForbiddenMoreKey<GenericInput extends ClientResponse, GenericSelector extends Record<string, boolean>, GenericProperty extends "information" | "code"> = DObject.ForbiddenKey<GenericSelector, Exclude<`${Extract<keyof GenericSelector, string | number>}`, `${GenericInput[GenericProperty]}`>>;
export declare class PromiseRequest<GenericHookParams extends Record<string, unknown> = Record<string, unknown>, GenericClientResponse extends AllClientResponse<GenericHookParams> = AllClientResponse<GenericHookParams>> extends Promise<MaybeResponse<GenericClientResponse | AllNotPredictedClientResponse<GenericHookParams>>> {
    params: PromiseRequestParams;
    readonly hooks: Partial<Hooks>;
    constructor(params: PromiseRequestParams);
    addRequestInterceptor(callback: (requestParams: GenericClientResponse["requestParams"]) => DCommon.MaybePromise<GenericClientResponse["requestParams"]>): this;
    addResponseInterceptor(callback: (response: GenericClientResponse) => DCommon.MaybePromise<GenericClientResponse>): this;
    whenNotPredictedResponse(callback: NotPredictedResponseHook<GenericHookParams>): this;
    whenInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[], callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenCode<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[], callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenInformationalResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenSuccessfulResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenRedirectionResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenClientErrorResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenServerErrorResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenExpectedResponse(callback: (response: DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>) => DCommon.MaybePromise<void>): this;
    whenError(callback: ErrorHook<GenericHookParams>): this;
    whenReceiveServerEvent<GenericEvent extends (GenericClientResponse extends ClientEventsResponseHandler<infer InferredEvent> ? InferredEvent : never), GenericEventName extends GenericEvent["event"]>(eventName: GenericEventName, callback: (event: NoInfer<DCommon.NeverCoalescing<Extract<GenericEvent, {
        event: GenericEventName;
    }>, ServerEvent>>, response: DCommon.NeverCoalescing<Extract<GenericClientResponse, ClientEventsResponseHandler<GenericEvent>>, ClientEventsResponse>) => DCommon.MaybePromise<void>): this;
    whenReceiveDataStream<GenericFlux extends (GenericClientResponse extends ClientStreamResponseHandler<infer InferredFlux> ? InferredFlux : never)>(callback: (data: GenericFlux, response: DCommon.NeverCoalescing<Extract<GenericClientResponse, ClientStreamResponseHandler>, ClientStreamResponse>) => DCommon.MaybePromise<void>): this;
    iWantInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>, GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>>(information: GenericInformation | GenericInformation[]): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantCode<GenericCode extends GenericClientResponse["code"], GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>>(code: GenericCode | GenericCode[]): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantInformationalResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantSuccessfulResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantRedirectionResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantClientErrorResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantServerErrorResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantExpectedResponse<GenericResponse extends DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, DCommon.NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iSelectExpectedResponseByInformation<const GenericSelector extends Record<Extract<GenericClientResponse["information"], string>, boolean>, GenericResponse extends Extract<GenericClientResponse, {
        information: DObject.GetPropsWithValue<GenericSelector, true>;
    } | {
        information: DObject.GetPropsWithValue<GenericSelector, boolean>;
    }>, GenericUnexpectedResponse extends Extract<GenericClientResponse, {
        information: DObject.GetPropsWithValue<GenericSelector, false>;
    } | {
        information: DObject.GetPropsWithValue<GenericSelector, boolean>;
    }>>(selector: (GenericSelector & ForbiddenMoreKey<GenericClientResponse, GenericSelector, "information">)): Promise<MaybeWantedResponse<DCommon.NeverCoalescing<GenericResponse, AllClientResponse<GenericHookParams>>, DCommon.NeverCoalescing<GenericUnexpectedResponse, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantInformationOrThrow<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[]): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>>;
    iWantCodeOrThrow<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[]): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>>;
    iWantInformationalResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantSuccessfulResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantRedirectionResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantClientErrorResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantServerErrorResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantExpectedResponseOrThrow(): Promise<DCommon.NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iSelectExpectedResponseByInformationOrThrow<const GenericSelector extends Record<Extract<GenericClientResponse["information"], string>, boolean>, GenericResponse extends Extract<GenericClientResponse, {
        information: DObject.GetPropsWithValue<GenericSelector, true>;
    } | {
        information: DObject.GetPropsWithValue<GenericSelector, boolean>;
    }>>(selector: (GenericSelector & ForbiddenMoreKey<GenericClientResponse, GenericSelector, "information">)): Promise<DCommon.NeverCoalescing<GenericResponse, AllClientResponse<GenericHookParams>>>;
    toEitherByInformation<const GenericSelector extends Record<Extract<GenericClientResponse["information"], string>, boolean>>(selector: (GenericSelector & ForbiddenMoreKey<GenericClientResponse, GenericSelector, "information">)): Promise<ResponseToEitherByInformation<GenericHookParams, GenericClientResponse, GenericSelector>>;
    toEitherByCode<const GenericSelector extends Record<GenericClientResponse["code"], boolean>>(selector: (GenericSelector & ForbiddenMoreKey<GenericClientResponse, GenericSelector, "code">)): Promise<ResponseToEitherByCode<GenericHookParams, GenericClientResponse, GenericSelector>>;
    static get [Symbol.species](): PromiseConstructor;
    static fetch<GenericPromiseRequestParams extends PromiseRequestParams>(requestParams: GenericPromiseRequestParams): Promise<MaybeResponse>;
}
export {};
