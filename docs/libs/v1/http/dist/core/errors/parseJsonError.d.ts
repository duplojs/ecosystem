import * as DKind from "@duplojs-v1/lang/kind";
declare const ParseJsonError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/parse-json-error", unknown>>, ErrorConstructor>;
export declare class ParseJsonError extends ParseJsonError_base {
    payload: string;
    error: unknown;
    constructor(payload: string, error: unknown);
}
export {};
