import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
declare const InvalidPlatformPathError_base: abstract new (error: string) => DCommon.DuploJSError<"invalid-platform-path", string> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-invalid-platform-path", unknown>>, unknown>;
export declare class InvalidPlatformPathError extends InvalidPlatformPathError_base {
}
export declare function toPlatformPathOrThrow(path: DPath.AnyPath): string;
export {};
