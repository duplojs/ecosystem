import { ObjectCanBeEmpty } from './ObjectCanBeEmpty';
import { CreateClientCacheKey } from './clientCache';
import { RouteContractParams, RouteContractHeaders, RouteContractQuery, RouteContract } from '../../core/index.ts';
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DChrono from "@duplojs/lang/chrono";
export interface ClientRequestInitParams extends Pick<RequestInit, "cache" | "credentials" | "integrity" | "keepalive" | "mode" | "redirect" | "referrer" | "referrerPolicy" | "signal"> {
}
export type ClientRequestParamsHeaders = RouteContractHeaders;
export type ClientRequestParamsParams = RouteContractParams;
export type ClientRequestParamsQuery = RouteContractQuery;
export type ClientRequestParamsBody = unknown;
export interface ClientRequestParams<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> {
    method: string;
    path: string;
    headers?: ClientRequestParamsHeaders;
    params?: ClientRequestParamsParams;
    query?: ClientRequestParamsQuery;
    body?: ClientRequestParamsBody;
    abortController?: AbortController;
    initParams?: ClientRequestInitParams;
    hookParams?: GenericHookParams;
    clientCache?: "auto" | CreateClientCacheKey<GenericHookParams>;
    bypassClientCache?: boolean;
    refreshClientCache?: boolean;
}
type MaybeParams<GenericParams extends object> = {
    [Prop in keyof GenericParams]-?: undefined extends GenericParams[Prop] ? Prop : GenericParams[Prop] extends object ? ObjectCanBeEmpty<GenericParams[Prop]> extends true ? Prop : never : never;
}[keyof GenericParams] extends infer InferredKeys extends keyof GenericParams ? DObject.PartialKeys<GenericParams, InferredKeys> : never;
export type RouteContractToClientRequestParams<GenericRouteContract extends RouteContract = RouteContract, GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = GenericRouteContract extends any ? DCommon.SimplifyTopLevel<({
    method: GenericRouteContract["method"];
    path: GenericRouteContract["path"];
    abortController?: AbortController;
    initParams?: ClientRequestInitParams;
    hookParams?: GenericHookParams;
    bypassClientCache?: boolean;
    refreshClientCache?: boolean;
    clientCache?: "auto" | CreateClientCacheKey<GenericHookParams>;
} & MaybeParams<(DCommon.IsEqual<GenericRouteContract["headers"], unknown> extends true ? {} : {
    headers: GenericRouteContract["headers"];
}) & (DCommon.IsEqual<GenericRouteContract["params"], unknown> extends true ? {} : {
    params: GenericRouteContract["params"];
}) & (DCommon.IsEqual<GenericRouteContract["query"], unknown> extends true ? {} : {
    query: GenericRouteContract["query"];
}) & (DCommon.IsEqual<GenericRouteContract["body"], unknown> extends true ? {} : {
    body: GenericRouteContract["body"] extends DCommon.TheFormData<infer InferredValue> ? DCommon.TheFormData<DCommon.ToJson<InferredValue, File | DChrono.TheDate | DChrono.TheTime>> : DCommon.ToJson<GenericRouteContract["body"], DChrono.TheDate | DChrono.TheTime>;
})>)> extends infer InferredResult extends ClientRequestParams<GenericHookParams> ? InferredResult : never : never;
export {};
