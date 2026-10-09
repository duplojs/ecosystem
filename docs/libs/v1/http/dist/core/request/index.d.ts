import { BodyResult, BodyReader } from './bodyController';
import type * as DObject from "@duplojs-v1/lang/object";
import * as DKind from "@duplojs-v1/lang/kind";
import type * as DPath from "@duplojs-v1/lang/path";
export * from './bodyController';
export interface RequestMethodsWrapper {
    GET: true;
    POST: true;
    PUT: true;
    PATCH: true;
    DELETE: true;
    HEAD: true;
    OPTIONS: true;
    TRACE: true;
    CONNECT: true;
}
export type RequestMethods = DObject.GetPropsWithValue<RequestMethodsWrapper, true>;
export interface RequestInitializationData {
    readonly headers: Partial<Record<string, string | readonly string[]>>;
    readonly host: string;
    readonly matchedPath: string | null;
    readonly method: string;
    readonly origin: string;
    readonly params: Record<string, string>;
    readonly path: string;
    readonly query: Record<string, string | readonly string[]>;
    readonly url: string;
    readonly bodyReader: BodyReader;
}
declare const Request_base: new <GenericKindValue extends unknown = unknown, GenericParentInstance extends never = never>(kindValue: GenericKindValue) => import('@duplojs-v1/lang').NeverCoalescing<GenericParentInstance, {}> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/request", unknown>>, GenericKindValue>;
export declare class Request extends Request_base implements RequestInitializationData {
    method: string;
    headers: Partial<Record<string, string | readonly string[]>>;
    url: string;
    host: string;
    origin: string;
    path: string;
    params: Record<string, string>;
    query: Record<string, string | readonly string[]>;
    matchedPath: string | null;
    bodyReader: BodyReader;
    private bodyResult?;
    filesAttache: readonly (string & DPath.Path)[] | undefined;
    constructor({ method, headers, url, host, origin, path, params, query, matchedPath, bodyReader, ...rest }: RequestInitializationData);
    getBodyResult(): BodyResult;
}
