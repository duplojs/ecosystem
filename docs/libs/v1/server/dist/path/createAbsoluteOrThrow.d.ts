import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
declare const CreateAbsolutePathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-absolute-path-error", string> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-absolute-path-error", unknown>>, unknown>;
export declare class CreateAbsolutePathError extends CreateAbsolutePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createAbsoluteOrThrow(value: string): string & DPath.Absolute & DPath.Path;
export {};
