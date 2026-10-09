import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare const ReadJsonFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-not-found", unknown>>, unknown>;
declare class ReadJsonFileErrorNotFound extends ReadJsonFileErrorNotFound_base {
}
declare const ReadJsonFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-permission-denied", unknown>>, unknown>;
declare class ReadJsonFileErrorPermissionDenied extends ReadJsonFileErrorPermissionDenied_base {
}
declare const ReadJsonFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-is-directory", unknown>>, unknown>;
declare class ReadJsonFileErrorIsDirectory extends ReadJsonFileErrorIsDirectory_base {
}
declare const ReadJsonFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-not-directory", unknown>>, unknown>;
declare class ReadJsonFileErrorNotDirectory extends ReadJsonFileErrorNotDirectory_base {
}
declare const ReadJsonFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-too-many-open-files", unknown>>, unknown>;
declare class ReadJsonFileErrorTooManyOpenFiles extends ReadJsonFileErrorTooManyOpenFiles_base {
}
declare const ReadJsonFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-busy", unknown>>, unknown>;
declare class ReadJsonFileErrorBusy extends ReadJsonFileErrorBusy_base {
}
declare const ReadJsonFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-json-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-json-file-error", unknown>>, unknown>;
declare class ReadJsonFileError extends ReadJsonFileError_base {
}
export type ReadJsonFileErrors = (ReadJsonFileErrorNotFound | ReadJsonFileErrorPermissionDenied | ReadJsonFileErrorIsDirectory | ReadJsonFileErrorNotDirectory | ReadJsonFileErrorTooManyOpenFiles | ReadJsonFileErrorBusy | ReadJsonFileError);
export type ReadJsonFileResult = (DEither.Right<"file-system-read-json-file", DCommon.Json> | DEither.Left<"file-system-read-json-file-error", ReadJsonFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readJsonFile(path: string & DPath.Path): Promise<ReadJsonFileResult>;
    }
}
export declare const readJsonFile: (path: string & DPath.Path) => Promise<ReadJsonFileResult>;
export {};
