import * as DKind from "@duplojs-v1/lang/kind";
declare const WrongContentTypeError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/wrong-content-type-error", unknown>>, ErrorConstructor>;
export declare class WrongContentTypeError extends WrongContentTypeError_base {
    expectedContentType: string;
    contentType: string;
    constructor(expectedContentType: string, contentType: string);
}
export {};
