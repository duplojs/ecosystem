import { PromiseRequestParams, ClientResponse } from './types';
import * as DKind from "@duplojs-v1/lang/kind";
export interface RequestErrorContent {
    error: unknown;
    requestParams: PromiseRequestParams;
}
declare const UnexpectedInformationResponseError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpClient/unexpected-information-response-error", unknown>>, ErrorConstructor>;
export declare class UnexpectedInformationResponseError extends UnexpectedInformationResponseError_base {
    information: string | string[];
    response: RequestErrorContent | ClientResponse;
    constructor(information: string | string[], response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedCodeResponseError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpClient/unexpected-code-response-error", unknown>>, ErrorConstructor>;
export declare class UnexpectedCodeResponseError extends UnexpectedCodeResponseError_base {
    code: string | string[];
    response: RequestErrorContent | ClientResponse;
    constructor(code: string | string[], response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedResponseTypeError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpClient/unexpected-response-type-error", unknown>>, ErrorConstructor>;
export declare class UnexpectedResponseTypeError extends UnexpectedResponseTypeError_base {
    expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError";
    response: RequestErrorContent | ClientResponse;
    constructor(expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError", response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedResponseError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpClient/unexpected-response-error", unknown>>, ErrorConstructor>;
export declare class UnexpectedResponseError extends UnexpectedResponseError_base {
    response: RequestErrorContent | ClientResponse;
    constructor(response: RequestErrorContent | ClientResponse);
}
export {};
