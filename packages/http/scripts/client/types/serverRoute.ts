import type * as DCommon from "@duplojs/lang/common";
import { type ResponseCode } from "./responseCode";

export type ServerPrimitiveData = string | undefined | number | null | boolean;

export type ServerRouteHeaders = Record<string, ServerPrimitiveData | { toString(): string }>;

export type ServerRouteParams = Record<string, ServerPrimitiveData | { toString(): string }>;

export type ServerRouteQuery = Record<string, DCommon.MaybeArray<ServerPrimitiveData | { toString(): string }>>;

export type ServerRouteBody = unknown;

export type ServerRouteResponseBody = unknown;

export type ServerRouteResponseFlux = string | Uint8Array<ArrayBuffer>;

export type ServerRouteResponseEvents = Record<string, unknown>;

export interface ServerRouteResponse {
	readonly code: ResponseCode;
	readonly information?: string;
	readonly body?: ServerRouteResponseBody;
	readonly events?: ServerRouteResponseEvents;
	readonly flux?: ServerRouteResponseFlux;
}

export interface ServerRoute {
	readonly path: string;
	readonly method: string;
	readonly headers?: ServerRouteHeaders;
	readonly params?: ServerRouteParams;
	readonly query?: ServerRouteQuery;
	readonly body?: ServerRouteBody;
	readonly responses: ServerRouteResponse;
}

export type GetServerRoutePath<
	GenericServerRoute extends ServerRoute,
	GenericPath extends GenericServerRoute["path"],
> = GenericServerRoute extends ServerRoute
	? DCommon.IsEqual<
		Extract<GenericPath, GenericServerRoute["path"]>,
		never
	> extends true
		? never
		: GenericServerRoute["path"]
	: never;

export type AddPrefixPathServerRoute<
	GenericRoute extends ServerRoute,
	GenericPrefix extends string,
> = GenericRoute extends ServerRoute
	? DCommon.SimplifyTopLevel<
		{ readonly path: `${GenericPrefix}${GenericRoute["path"]}` }
		& Omit<GenericRoute, "path">
	>
	: never;

export type RemovePrefixPathServerRoute<
	GenericRoute extends ServerRoute,
	GenericPrefix extends string,
> = GenericRoute extends ServerRoute
	? GenericRoute["path"] extends `${GenericPrefix}${infer InferredPathRest}`
		? DCommon.SimplifyTopLevel<
			{ readonly path: InferredPathRest }
			& Omit<GenericRoute, "path">
		>
		: GenericRoute
	: never;

export type FindServerRoute<
	GenericRoute extends ServerRoute,
	GenericMethod extends GenericRoute["method"],
	GenericPath extends Extract<GenericRoute, { method: GenericMethod }>["path"] = Extract<GenericRoute, { method: GenericMethod }>["path"],
> = Extract<
	GenericRoute,
	{
		method: GenericMethod;
		path: GenericPath;
	}
>;

export type FindServerRouteResponse<
	GenericRoute extends ServerRoute,
	GenericKey extends "code" | "information",
	GenericValue extends GenericRoute["responses"][GenericKey] = GenericRoute["responses"][GenericKey],
> = Extract<
	GenericRoute["responses"],
	{ [Prop in GenericKey]: GenericValue }
>;
