import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DCommon from "@duplojs-v1/lang/common";
interface ReadDirectoryParams {
    recursive?: boolean;
}
declare const ReadDirectoryErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-not-found", unknown>>, unknown>;
declare class ReadDirectoryErrorNotFound extends ReadDirectoryErrorNotFound_base {
}
declare const ReadDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-permission-denied", unknown>>, unknown>;
declare class ReadDirectoryErrorPermissionDenied extends ReadDirectoryErrorPermissionDenied_base {
}
declare const ReadDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-not-directory", unknown>>, unknown>;
declare class ReadDirectoryErrorNotDirectory extends ReadDirectoryErrorNotDirectory_base {
}
declare const ReadDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-too-many-open-files", unknown>>, unknown>;
declare class ReadDirectoryErrorTooManyOpenFiles extends ReadDirectoryErrorTooManyOpenFiles_base {
}
declare const ReadDirectoryErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-busy", unknown>>, unknown>;
declare class ReadDirectoryErrorBusy extends ReadDirectoryErrorBusy_base {
}
declare const ReadDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-error", unknown>>, unknown>;
declare class ReadDirectoryError extends ReadDirectoryError_base {
}
export type ReadDirectoryErrors = (ReadDirectoryErrorNotFound | ReadDirectoryErrorPermissionDenied | ReadDirectoryErrorNotDirectory | ReadDirectoryErrorTooManyOpenFiles | ReadDirectoryErrorBusy | ReadDirectoryError);
export type ReadDirectoryResult = (DEither.Right<"file-system-read-directory", (string & DPath.Path)[]> | DEither.Left<"file-system-read-directory-error", ReadDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readDirectory(path: string & DPath.Path, params?: ReadDirectoryParams): Promise<ReadDirectoryResult>;
    }
}
export declare const readDirectory: (path: string & DPath.Path, params?: ReadDirectoryParams) => Promise<ReadDirectoryResult>;
export {};
