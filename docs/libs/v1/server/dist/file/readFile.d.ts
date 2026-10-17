import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
declare const ReadFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-not-found", unknown>>, unknown>;
declare class ReadFileErrorNotFound extends ReadFileErrorNotFound_base {
}
declare const ReadFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-permission-denied", unknown>>, unknown>;
declare class ReadFileErrorPermissionDenied extends ReadFileErrorPermissionDenied_base {
}
declare const ReadFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-is-directory", unknown>>, unknown>;
declare class ReadFileErrorIsDirectory extends ReadFileErrorIsDirectory_base {
}
declare const ReadFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-not-directory", unknown>>, unknown>;
declare class ReadFileErrorNotDirectory extends ReadFileErrorNotDirectory_base {
}
declare const ReadFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-too-many-open-files", unknown>>, unknown>;
declare class ReadFileErrorTooManyOpenFiles extends ReadFileErrorTooManyOpenFiles_base {
}
declare const ReadFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-busy", unknown>>, unknown>;
declare class ReadFileErrorBusy extends ReadFileErrorBusy_base {
}
declare const ReadFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-file-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-file-error", unknown>>, unknown>;
declare class ReadFileError extends ReadFileError_base {
}
export type ReadFileErrors = (ReadFileErrorNotFound | ReadFileErrorPermissionDenied | ReadFileErrorIsDirectory | ReadFileErrorNotDirectory | ReadFileErrorTooManyOpenFiles | ReadFileErrorBusy | ReadFileError);
export type ReadFileResult = (DEither.Right<"file-system-read-file", Uint8Array> | DEither.Left<"file-system-read-file-error", ReadFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readFile(path: string & DPath.Path): Promise<ReadFileResult>;
    }
}
export declare const readFile: (path: string & DPath.Path) => Promise<ReadFileResult>;
export {};
