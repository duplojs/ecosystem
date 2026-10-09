import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare const RealPathErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-real-path-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-real-path-not-found", unknown>>, unknown>;
declare class RealPathErrorNotFound extends RealPathErrorNotFound_base {
}
declare const RealPathErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-real-path-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-real-path-permission-denied", unknown>>, unknown>;
declare class RealPathErrorPermissionDenied extends RealPathErrorPermissionDenied_base {
}
declare const RealPathErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-real-path-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-real-path-not-directory", unknown>>, unknown>;
declare class RealPathErrorNotDirectory extends RealPathErrorNotDirectory_base {
}
declare const RealPathErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-real-path-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-real-path-too-many-open-files", unknown>>, unknown>;
declare class RealPathErrorTooManyOpenFiles extends RealPathErrorTooManyOpenFiles_base {
}
declare const RealPathError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-real-path-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-real-path-error", unknown>>, unknown>;
declare class RealPathError extends RealPathError_base {
}
export type RealPathErrors = (RealPathErrorNotFound | RealPathErrorPermissionDenied | RealPathErrorNotDirectory | RealPathErrorTooManyOpenFiles | RealPathError);
export type RealPathResult = (DEither.Right<"file-system-real-path", string> | DEither.Left<"file-system-real-path-error", RealPathErrors>);
declare module '../implementor' {
    interface ServerFunction {
        realPath(path: string & DPath.Path): Promise<RealPathResult>;
    }
}
export declare const realPath: (path: string & DPath.Path) => Promise<RealPathResult>;
export {};
