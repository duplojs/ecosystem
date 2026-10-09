import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare const ReadTextFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-not-found", unknown>>, unknown>;
declare class ReadTextFileErrorNotFound extends ReadTextFileErrorNotFound_base {
}
declare const ReadTextFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-permission-denied", unknown>>, unknown>;
declare class ReadTextFileErrorPermissionDenied extends ReadTextFileErrorPermissionDenied_base {
}
declare const ReadTextFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-is-directory", unknown>>, unknown>;
declare class ReadTextFileErrorIsDirectory extends ReadTextFileErrorIsDirectory_base {
}
declare const ReadTextFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-not-directory", unknown>>, unknown>;
declare class ReadTextFileErrorNotDirectory extends ReadTextFileErrorNotDirectory_base {
}
declare const ReadTextFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-too-many-open-files", unknown>>, unknown>;
declare class ReadTextFileErrorTooManyOpenFiles extends ReadTextFileErrorTooManyOpenFiles_base {
}
declare const ReadTextFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-busy", unknown>>, unknown>;
declare class ReadTextFileErrorBusy extends ReadTextFileErrorBusy_base {
}
declare const ReadTextFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-error", unknown>>, unknown>;
declare class ReadTextFileError extends ReadTextFileError_base {
}
export type ReadTextFileErrors = (ReadTextFileErrorNotFound | ReadTextFileErrorPermissionDenied | ReadTextFileErrorIsDirectory | ReadTextFileErrorNotDirectory | ReadTextFileErrorTooManyOpenFiles | ReadTextFileErrorBusy | ReadTextFileError);
export type ReadTextFileResult = (DEither.Right<"file-system-read-text-file", string> | DEither.Left<"file-system-read-text-file-error", ReadTextFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readTextFile(path: string & DPath.Path): Promise<ReadTextFileResult>;
    }
}
export declare const readTextFile: (path: string & DPath.Path) => Promise<ReadTextFileResult>;
export {};
