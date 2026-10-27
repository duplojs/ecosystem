import { RoutePath } from '../route';
import type * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";
export type RouteContractHeadersPrimitiveData = DCommon.MaybeConstraint<string | undefined | number | null | boolean | DChrono.TheDate | DChrono.TheTime>;
export type RouteContractHeaders = Record<string, RouteContractHeadersPrimitiveData | {
    toString(): string;
}>;
export type RouteContractParams = Record<string, RouteContractHeadersPrimitiveData | {
    toString(): string;
}>;
export type RouteContractQuery = Record<string, DCommon.MaybeArray<RouteContractHeadersPrimitiveData | {
    toString(): string;
}>>;
export type RouteContractBody = unknown;
export type RouteContractResponseFlux = (DCommon.MaybeConstraint<string> | Uint8Array<ArrayBuffer>);
export type RouteContractResponseEvents = Record<string, unknown>;
export interface RouteContractResponseDefault {
    readonly code: `${number}`;
    readonly information?: string;
    readonly body: RouteContractBody;
}
export interface RouteContractResponseSSE {
    readonly code: `${number}`;
    readonly information?: string;
    readonly events: RouteContractResponseEvents;
}
export interface RouteContractResponseStream {
    readonly code: `${number}`;
    readonly information?: string;
    readonly flux: RouteContractResponseFlux;
}
export type RouteContractResponse = (RouteContractResponseDefault | RouteContractResponseSSE | RouteContractResponseStream);
export interface RouteContract {
    readonly method: Uppercase<string>;
    readonly path: RoutePath;
    readonly headers?: RouteContractHeaders;
    readonly params?: RouteContractParams;
    readonly query?: RouteContractQuery;
    readonly body?: RouteContractBody;
    readonly responses: RouteContractResponse;
}
export type AddPrefixPathRouteContract<GenericRoute extends RouteContract, GenericPrefix extends string> = GenericRoute extends RouteContract ? DCommon.SimplifyTopLevel<{
    readonly path: `${GenericPrefix}${GenericRoute["path"]}`;
} & Omit<GenericRoute, "path">> : never;
export type RemovePrefixPathRouteContract<GenericRoute extends RouteContract, GenericPrefix extends string> = GenericRoute extends RouteContract ? GenericRoute["path"] extends `${GenericPrefix}${infer InferredPathRest}` ? DCommon.SimplifyTopLevel<{
    readonly path: InferredPathRest;
} & Omit<GenericRoute, "path">> : GenericRoute : never;
export type FindRouteContract<GenericRoute extends RouteContract, GenericMethod extends GenericRoute["method"], GenericPath extends Extract<GenericRoute, {
    method: GenericMethod;
}>["path"] = Extract<GenericRoute, {
    method: GenericMethod;
}>["path"]> = Extract<GenericRoute, {
    method: GenericMethod;
    path: GenericPath;
}>;
export type FindRouteContractResponse<GenericRoute extends RouteContract, GenericKey extends "code" | "information", GenericValue extends GenericRoute["responses"][GenericKey] = GenericRoute["responses"][GenericKey]> = Extract<GenericRoute["responses"], {
    [Prop in GenericKey]: GenericValue;
}>;
