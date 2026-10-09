import * as DChrono from "@duplojs-v1/lang/chrono";
import * as DKind from "@duplojs-v1/lang/kind";
declare const SerializeCookieError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsCookiePlugin/serialize-cookie-error", unknown>>, ErrorConstructor>;
export declare class SerializeCookieError extends SerializeCookieError_base {
    constructor(message: string);
}
interface SerializerParamsBase {
    maxAge?: number;
    domain?: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    partitioned?: boolean;
    priority?: "low" | "medium" | "high";
    sameSite?: "lax" | "strict" | "none";
}
export interface SerializerParamsWithExpires extends SerializerParamsBase {
    expires?: DChrono.TheDate;
    expireIn?: undefined;
}
export interface SerializerParamsWithExpireIn extends SerializerParamsBase {
    expires?: undefined;
    expireIn?: DChrono.TheTime;
}
export type SerializerParams = SerializerParamsWithExpires | SerializerParamsWithExpireIn;
export declare function defaultSerializer(name: string, value: string, params?: SerializerParams): string;
export type Serializer = typeof defaultSerializer;
export {};
