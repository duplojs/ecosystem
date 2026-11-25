import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
declare const CreatePathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-path-error", string> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-path-error", unknown>>, unknown>;
export declare class CreatePathError extends CreatePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createOrThrow(value: string): string & DPath.Path;
export {};
