import type * as DString from "@duplojs-v1/lang/string";
import * as DKind from "@duplojs-v1/lang/kind";
export type InformationResponseCode = `1${DString.Digit}${DString.Digit}`;
export type SuccessResponseCode = `2${DString.Digit}${DString.Digit}`;
export type RedirectionResponseCode = `3${DString.Digit}${DString.Digit}`;
export type ClientErrorResponseCode = `4${DString.Digit}${DString.Digit}`;
export type ServerErrorResponseCode = `5${DString.Digit}${DString.Digit}`;
export type ResponseCode = (InformationResponseCode | SuccessResponseCode | RedirectionResponseCode | ClientErrorResponseCode | ServerErrorResponseCode);
declare const Response_base: new <GenericKindValue extends unknown = unknown, GenericParentInstance extends never = never>(kindValue: GenericKindValue) => import('@duplojs-v1/lang').NeverCoalescing<GenericParentInstance, {}> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/response", unknown>>, GenericKindValue>;
export declare class Response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends Response_base {
    code: GenericCode;
    information: GenericInformation;
    body: GenericBody;
    headers: Record<string, string | string[]> | undefined;
    constructor(code: GenericCode, information: GenericInformation, body: GenericBody);
    setHeaders(headers: Partial<Record<string, string | string[]>>): this;
    setHeader(key: string, header?: string | string[]): this;
    deleteHeader(key: string): this;
}
export {};
