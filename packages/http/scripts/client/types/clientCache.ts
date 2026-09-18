import { type ClientRequestParamsBody, type ClientRequestParamsHeaders, type ClientRequestParamsParams, type ClientRequestParamsQuery } from "./clientRequestParams";
import { type ClientResponseBody } from "./clientResponse";
import type * as DCommon from "@duplojs/lang/common";
import { type ResponseCode } from "./responseCode";

export interface ClientCacheValue {
	information?: string;
	body: ClientResponseBody;
	headers: Record<string, string>;
	ok: boolean | null;
	type: ResponseType;
	code: ResponseCode;
	url: string;
	redirected: boolean;
	predicted: boolean;
}

export type ClientCacheInitialValues = Record<string, ClientCacheValue>;

export type ClientCacheStore = Map<string, ClientCacheValue>;

export interface CreateClientCacheKeyParams<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
	method: string;
	path: string;
	headers: ClientRequestParamsHeaders | undefined;
	params: ClientRequestParamsParams | undefined;
	query: ClientRequestParamsQuery | undefined;
	body: ClientRequestParamsBody;
	hookParams: GenericHookParams | undefined;
}

export type CreateClientCacheKey<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = DCommon.BivariantFunction<(params: CreateClientCacheKeyParams<GenericHookParams>) => string | null>;
