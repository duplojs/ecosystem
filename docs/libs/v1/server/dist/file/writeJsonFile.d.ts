import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface WriteJsonFileParams {
    space?: number;
}
declare const WriteJsonFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-not-found", unknown>>, unknown>;
declare class WriteJsonFileErrorNotFound extends WriteJsonFileErrorNotFound_base {
}
declare const WriteJsonFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-permission-denied", unknown>>, unknown>;
declare class WriteJsonFileErrorPermissionDenied extends WriteJsonFileErrorPermissionDenied_base {
}
declare const WriteJsonFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-is-directory", unknown>>, unknown>;
declare class WriteJsonFileErrorIsDirectory extends WriteJsonFileErrorIsDirectory_base {
}
declare const WriteJsonFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-not-directory", unknown>>, unknown>;
declare class WriteJsonFileErrorNotDirectory extends WriteJsonFileErrorNotDirectory_base {
}
declare const WriteJsonFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-no-space", unknown>>, unknown>;
declare class WriteJsonFileErrorNoSpace extends WriteJsonFileErrorNoSpace_base {
}
declare const WriteJsonFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-read-only", unknown>>, unknown>;
declare class WriteJsonFileErrorReadOnly extends WriteJsonFileErrorReadOnly_base {
}
declare const WriteJsonFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-invalid-argument", unknown>>, unknown>;
declare class WriteJsonFileErrorInvalidArgument extends WriteJsonFileErrorInvalidArgument_base {
}
declare const WriteJsonFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-too-many-open-files", unknown>>, unknown>;
declare class WriteJsonFileErrorTooManyOpenFiles extends WriteJsonFileErrorTooManyOpenFiles_base {
}
declare const WriteJsonFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-busy", unknown>>, unknown>;
declare class WriteJsonFileErrorBusy extends WriteJsonFileErrorBusy_base {
}
declare const WriteJsonFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-error", unknown>>, unknown>;
declare class WriteJsonFileError extends WriteJsonFileError_base {
}
export type WriteJsonFileErrors = (WriteJsonFileErrorNotFound | WriteJsonFileErrorPermissionDenied | WriteJsonFileErrorIsDirectory | WriteJsonFileErrorNotDirectory | WriteJsonFileErrorNoSpace | WriteJsonFileErrorReadOnly | WriteJsonFileErrorInvalidArgument | WriteJsonFileErrorTooManyOpenFiles | WriteJsonFileErrorBusy | WriteJsonFileError);
export type WriteJsonFileResult = (DEither.Right<"file-system-write-json-file", void> | DEither.Left<"file-system-write-json-file-error", WriteJsonFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        writeJsonFile(path: string & DPath.Path, data: unknown, params?: WriteJsonFileParams): Promise<WriteJsonFileResult>;
    }
}
export declare function writeJsonFile(data: unknown): (path: string & DPath.Path) => Promise<WriteJsonFileResult>;
export declare function writeJsonFile(path: string & DPath.Path, data: unknown, params?: WriteJsonFileParams): Promise<WriteJsonFileResult>;
export {};
