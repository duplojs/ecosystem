import type * as DCommon from "@duplojs/lang/common";
import { type RouteContractParams, type RouteContractHeaders, type RouteContractQuery, type RouteContractBody } from "@core";
import { type ClientResponseBody } from "./clientResponse";

export interface ClientCacheValue {
	information?: string;
	body: ClientResponseBody;
	headers: Record<string, string>;
	ok: boolean | null;
	type: ResponseType;
	code: `${number}`;
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
	headers: RouteContractHeaders | undefined;
	params: RouteContractParams | undefined;
	query: RouteContractQuery | undefined;
	body: RouteContractBody;
	hookParams: GenericHookParams | undefined;
}

export type CreateClientCacheKey<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = DCommon.BivariantFunction<(params: CreateClientCacheKeyParams<GenericHookParams>) => string | null>;
