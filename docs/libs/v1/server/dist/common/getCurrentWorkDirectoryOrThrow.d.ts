import * as DKind from "@duplojs/lang/kind";
declare const GetCurrentWorkDirectoryError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsServer/environment-variable-error", unknown>>, ErrorConstructor>;
export declare class GetCurrentWorkDirectoryError extends GetCurrentWorkDirectoryError_base {
    error: unknown;
    constructor(error: unknown);
}
export declare function getCurrentWorkDirectoryOrThrow(): string & import('@duplojs/lang/path').Absolute;
export {};
