import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
declare const ReadDirectoryErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-not-found", unknown>>, unknown>;
declare class ReadDirectoryErrorNotFound extends ReadDirectoryErrorNotFound_base {
}
declare const ReadDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-permission-denied", unknown>>, unknown>;
declare class ReadDirectoryErrorPermissionDenied extends ReadDirectoryErrorPermissionDenied_base {
}
declare const ReadDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-not-directory", unknown>>, unknown>;
declare class ReadDirectoryErrorNotDirectory extends ReadDirectoryErrorNotDirectory_base {
}
declare const ReadDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-too-many-open-files", unknown>>, unknown>;
declare class ReadDirectoryErrorTooManyOpenFiles extends ReadDirectoryErrorTooManyOpenFiles_base {
}
declare const ReadDirectoryErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-busy", unknown>>, unknown>;
declare class ReadDirectoryErrorBusy extends ReadDirectoryErrorBusy_base {
}
declare const ReadDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-directory-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-directory-error", unknown>>, unknown>;
declare class ReadDirectoryError extends ReadDirectoryError_base {
}
export type ReadDirectoryErrors = (ReadDirectoryErrorNotFound | ReadDirectoryErrorPermissionDenied | ReadDirectoryErrorNotDirectory | ReadDirectoryErrorTooManyOpenFiles | ReadDirectoryErrorBusy | ReadDirectoryError);
interface ReadDirectoryParams {
    recursive?: boolean;
    absolute?: boolean;
    matcher?: DPath.PathMatcher;
}
export type ReadDirectoryResult<GenericParams extends ReadDirectoryParams = ReadDirectoryParams> = (DEither.Right<"file-system-read-directory", readonly (string & DPath.Path & (DCommon.IsEqual<GenericParams["absolute"], true> extends true ? DPath.Absolute : unknown))[]> | DEither.Left<"file-system-read-directory-error", ReadDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readDirectory<const GenericParams extends ReadDirectoryParams = {}>(path: string & DPath.Path, params?: GenericParams): Promise<ReadDirectoryResult<GenericParams>>;
    }
}
export declare const readDirectory: <const GenericParams extends ReadDirectoryParams = {}>(path: string & DPath.Path, params?: GenericParams) => Promise<ReadDirectoryResult<GenericParams>>;
export {};
