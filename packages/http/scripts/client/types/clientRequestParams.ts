import type * as DCommon from "@duplojs/lang/common";
import { type ServerRouteHeaders, type ServerRouteParams, type ServerRouteQuery, type ServerRoute } from "./serverRoute";
import { type ObjectCanBeEmpty } from "./ObjectCanBeEmpty";
import type * as DObject from "@duplojs/lang/object";
import { type CreateClientCacheKey } from "./clientCache";
import type * as DChrono from "@duplojs/lang/chrono";

export interface ClientRequestInitParams extends Pick<
	RequestInit,
	| "cache"
	| "credentials"
	| "integrity"
	| "keepalive"
	| "mode"
	| "redirect"
	| "referrer"
	| "referrerPolicy"
	| "signal"
> {

}

export type ClientRequestParamsHeaders = ServerRouteHeaders;

export type ClientRequestParamsParams = ServerRouteParams;

export type ClientRequestParamsQuery = ServerRouteQuery;

export type ClientRequestParamsBody = unknown;

export interface ClientRequestParams<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
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

type MaybeParams<
	GenericParams extends object,
> = {
	[Prop in keyof GenericParams]-?: undefined extends GenericParams[Prop]
		? Prop
		: GenericParams[Prop] extends object
			? ObjectCanBeEmpty<GenericParams[Prop]> extends true
				? Prop
				: never
			: never
}[keyof GenericParams] extends infer InferredKeys extends keyof GenericParams
	? DObject.PartialKeys<GenericParams, InferredKeys>
	: never;

export type ServerRouteToClientRequestParams<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = GenericServerRoute extends any
	? DCommon.SimplifyTopLevel<(
		& {
			method: GenericServerRoute["method"];
			path: GenericServerRoute["path"];
			abortController?: AbortController;
			initParams?: ClientRequestInitParams;
			hookParams?: GenericHookParams;
			bypassClientCache?: boolean;
			refreshClientCache?: boolean;
			clientCache?: "auto" | CreateClientCacheKey<GenericHookParams>;
		}
		& MaybeParams<
			& (
				DCommon.IsEqual<GenericServerRoute["headers"], unknown> extends true
					? {}
					: {
						headers: GenericServerRoute["headers"];
					}
			)
			& (
				DCommon.IsEqual<GenericServerRoute["params"], unknown> extends true
					? {}
					: {
						params: GenericServerRoute["params"];
					}
			)
			& (
				DCommon.IsEqual<GenericServerRoute["query"], unknown> extends true
					? {}
					: {
						query: GenericServerRoute["query"];
					}
			)
			& (
				DCommon.IsEqual<GenericServerRoute["body"], unknown> extends true
					? {}
					: {
						body: GenericServerRoute["body"] extends DCommon.TheFormData<infer InferredValue>
							? DCommon.TheFormData<DCommon.ToJson<InferredValue, File>>
							: DCommon.ToJson<
								GenericServerRoute["body"],
								DChrono.TheDate | DChrono.TheTime
							>;
					}
			)
		>
	)> extends infer InferredResult extends ClientRequestParams<GenericHookParams>
		? InferredResult
		: never
	: never;
