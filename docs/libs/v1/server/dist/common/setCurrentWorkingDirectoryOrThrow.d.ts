import * as DKind from "@duplojs/lang/kind";
import type * as DPath from "@duplojs/lang/path";
declare const SetCurrentWorkingDirectoryError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsServer/set-working-directory-error", unknown>>, ErrorConstructor>;
export declare class SetCurrentWorkingDirectoryError extends SetCurrentWorkingDirectoryError_base {
    constructor();
}
export declare function setCurrentWorkingDirectoryOrThrow(path: string & DPath.Absolute): void;
export {};
