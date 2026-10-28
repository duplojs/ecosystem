import { ClientRequestInitParams, ClientRequestParams, Hooks, RequestHook, ResponseHook, InformationHook, CodeHook, ResponseTypeHook, ExpectedResponseHook, NotPredictedResponseHook, ErrorHook, AllClientResponse, BeforeRetryServerEventHook, CloseServerEventHook, ErrorServerEventHook, StartServerEventHook, ReceiveEventServerEventHook, ClientCacheInitialValues, ClientCacheStore, CloseStreamHook, ReceiveDataStreamHook, ErrorStreamHook, StartStreamHook, RouteContractToClientResponse, RouteContractToClientRequestParams } from './types';
import { PromiseRequest } from './promiseRequest';
import { RouteContract } from '../core/index.ts';
import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export declare const httpClientKind: DKind.Handler<DKind.Definition<"@DuplojsHttpClient/http-client", unknown>>;
type MaybeRequestParams<GenericRequestParams extends object> = {} extends GenericRequestParams ? [params?: GenericRequestParams] : [params: GenericRequestParams];
type GetRouteContractPath<GenericRouteContract extends RouteContract, GenericPath extends GenericRouteContract["path"]> = GenericRouteContract extends RouteContract ? DCommon.IsNever<Extract<GenericPath, GenericRouteContract["path"]>> extends true ? never : GenericRouteContract["path"] : never;
type HttpClientRequestMethod<GenericRouteContract extends RouteContract, GenericHookParams extends Record<string, unknown>, GenericMethod extends string> = DCommon.IsEqual<GenericRouteContract, RouteContract> extends true ? (path: string, params?: DCommon.SimplifyTopLevel<Omit<ClientRequestParams<GenericHookParams>, "method" | "path">>) => PromiseRequest<GenericHookParams, AllClientResponse<GenericHookParams>> : <GenericPath extends Extract<GenericRouteContract, {
    method: GenericMethod;
}>["path"], GenericMatchedPath extends GetRouteContractPath<Extract<GenericRouteContract, {
    method: GenericMethod;
}>, GenericPath>>(path: GenericPath, ...args: MaybeRequestParams<DCommon.SimplifyTopLevel<Omit<RouteContractToClientRequestParams<Extract<GenericRouteContract, {
    method: GenericMethod;
    path: GenericMatchedPath | GenericPath;
}>, GenericHookParams>, "method" | "path">>>) => PromiseRequest<GenericHookParams, RouteContractToClientResponse<Extract<GenericRouteContract, {
    method: GenericMethod;
    path: GenericMatchedPath;
}>, GenericHookParams>>;
export interface HttpClientConfig {
    readonly baseUrl: string;
    readonly informationHeaderKey: string;
    readonly predictedHeaderKey: string;
    readonly disabledPredictedMode: boolean;
    readonly credentials?: ClientRequestInitParams["credentials"];
    readonly cache?: ClientRequestInitParams["cache"];
    readonly clientCacheInitialValues?: ClientCacheInitialValues;
}
export interface HttpClient<GenericRouteContract extends RouteContract = RouteContract, GenericHookParams extends Record<string, unknown> = Record<string, unknown>> extends DKind.Kind<typeof httpClientKind> {
    readonly config: HttpClientConfig;
    readonly hooks: Hooks;
    readonly defaultHeaders: Map<string, () => (string | undefined | null)>;
    readonly cacheStore: ClientCacheStore;
    addDefaultHeader(headerName: string, headerValue: DCommon.MayBeGetter<string | undefined | null>): void;
    addDefaultHeaders(headers: Record<string, DCommon.MayBeGetter<string | undefined | null>>): void;
    addRequestHook(hook: RequestHook<GenericHookParams>): void;
    addResponseHook(hook: ResponseHook<GenericHookParams>): void;
    addInformationHook(information: string, hook: InformationHook<GenericHookParams>): void;
    addCodeHook(code: string, hook: CodeHook<GenericHookParams>): void;
    addInformationalResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addSuccessfulResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addRedirectionResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addClientErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addServerErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addExpectedResponseHook(hook: ExpectedResponseHook<GenericHookParams>): void;
    addNotPredictedResponseHook(hook: NotPredictedResponseHook<GenericHookParams>): void;
    addErrorHook(hook: ErrorHook<GenericHookParams>): void;
    addBeforeRetryServerEventHook(hook: BeforeRetryServerEventHook<GenericHookParams>): void;
    addCloseServerEventHook(hook: CloseServerEventHook<GenericHookParams>): void;
    addErrorServerEventHook(hook: ErrorServerEventHook<GenericHookParams>): void;
    addStartServerEventHook(hook: StartServerEventHook<GenericHookParams>): void;
    addReceiveEventServerEventHook(hook: ReceiveEventServerEventHook<GenericHookParams>): void;
    addCloseStreamHook(hook: CloseStreamHook<GenericHookParams>): void;
    addReceiveDataStreamHook(hook: ReceiveDataStreamHook<GenericHookParams>): void;
    addErrorStreamHook(hook: ErrorStreamHook<GenericHookParams>): void;
    addStartStreamHook(hook: StartStreamHook<GenericHookParams>): void;
    request<GenericClientRequestParams extends RouteContractToClientRequestParams<GenericRouteContract, GenericHookParams>, GenericMatchedPath extends GetRouteContractPath<Extract<GenericRouteContract, {
        method: GenericClientRequestParams["method"];
    }>, GenericClientRequestParams["path"]>>(params: GenericClientRequestParams): PromiseRequest<GenericHookParams, DCommon.IsEqual<GenericRouteContract, RouteContract> extends true ? AllClientResponse<GenericHookParams> : RouteContractToClientResponse<Extract<GenericRouteContract, {
        method: GenericClientRequestParams["method"];
        path: GenericMatchedPath;
    }>, GenericHookParams>>;
    get: HttpClientRequestMethod<GenericRouteContract, GenericHookParams, "GET">;
    post: HttpClientRequestMethod<GenericRouteContract, GenericHookParams, "POST">;
    put: HttpClientRequestMethod<GenericRouteContract, GenericHookParams, "PUT">;
    patch: HttpClientRequestMethod<GenericRouteContract, GenericHookParams, "PATCH">;
    delete: HttpClientRequestMethod<GenericRouteContract, GenericHookParams, "DELETE">;
}
export interface CreateHttpClientParams {
    readonly baseUrl: string;
    readonly hooks?: Partial<Hooks>;
    readonly credentials?: ClientRequestInitParams["credentials"];
    readonly cache?: ClientRequestInitParams["cache"];
    readonly informationHeaderKey?: string;
    readonly predictedHeaderKey?: string;
    readonly disabledPredictedMode?: boolean;
    readonly clientCacheInitialValues?: ClientCacheInitialValues;
}
export declare function createHttpClient<GenericRouteContract extends RouteContract = RouteContract, GenericHookParams extends Record<string, unknown> = Record<string, unknown>>(clientParams: CreateHttpClientParams): HttpClient<GenericRouteContract, GenericHookParams>;
export {};
