import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
declare const ReadTextFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-not-found", unknown>>, unknown>;
export declare class ReadTextFileErrorNotFound extends ReadTextFileErrorNotFound_base {
}
declare const ReadTextFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-permission-denied", unknown>>, unknown>;
export declare class ReadTextFileErrorPermissionDenied extends ReadTextFileErrorPermissionDenied_base {
}
declare const ReadTextFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-is-directory", unknown>>, unknown>;
export declare class ReadTextFileErrorIsDirectory extends ReadTextFileErrorIsDirectory_base {
}
declare const ReadTextFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-not-directory", unknown>>, unknown>;
export declare class ReadTextFileErrorNotDirectory extends ReadTextFileErrorNotDirectory_base {
}
declare const ReadTextFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-too-many-open-files", unknown>>, unknown>;
export declare class ReadTextFileErrorTooManyOpenFiles extends ReadTextFileErrorTooManyOpenFiles_base {
}
declare const ReadTextFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-busy", unknown>>, unknown>;
export declare class ReadTextFileErrorBusy extends ReadTextFileErrorBusy_base {
}
declare const ReadTextFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-text-file-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-text-file-error", unknown>>, unknown>;
export declare class ReadTextFileError extends ReadTextFileError_base {
}
export type ReadTextFileErrors = (ReadTextFileErrorNotFound | ReadTextFileErrorPermissionDenied | ReadTextFileErrorIsDirectory | ReadTextFileErrorNotDirectory | ReadTextFileErrorTooManyOpenFiles | ReadTextFileErrorBusy | ReadTextFileError);
export type ReadTextFileResult = (DEither.Right<"file-system-read-text-file", string> | DEither.Left<"file-system-read-text-file-error", ReadTextFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readTextFile(path: DPath.AnyPath): Promise<ReadTextFileResult>;
    }
}
export declare const readTextFile: (path: DPath.AnyPath) => Promise<ReadTextFileResult>;
export {};
