import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
interface WriteJsonFileParams {
    space?: number;
}
declare const WriteJsonFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-not-found", unknown>>, unknown>;
export declare class WriteJsonFileErrorNotFound extends WriteJsonFileErrorNotFound_base {
}
declare const WriteJsonFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-permission-denied", unknown>>, unknown>;
export declare class WriteJsonFileErrorPermissionDenied extends WriteJsonFileErrorPermissionDenied_base {
}
declare const WriteJsonFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-is-directory", unknown>>, unknown>;
export declare class WriteJsonFileErrorIsDirectory extends WriteJsonFileErrorIsDirectory_base {
}
declare const WriteJsonFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-not-directory", unknown>>, unknown>;
export declare class WriteJsonFileErrorNotDirectory extends WriteJsonFileErrorNotDirectory_base {
}
declare const WriteJsonFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-no-space", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-no-space", unknown>>, unknown>;
export declare class WriteJsonFileErrorNoSpace extends WriteJsonFileErrorNoSpace_base {
}
declare const WriteJsonFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-read-only", unknown>>, unknown>;
export declare class WriteJsonFileErrorReadOnly extends WriteJsonFileErrorReadOnly_base {
}
declare const WriteJsonFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-invalid-argument", unknown>>, unknown>;
export declare class WriteJsonFileErrorInvalidArgument extends WriteJsonFileErrorInvalidArgument_base {
}
declare const WriteJsonFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-too-many-open-files", unknown>>, unknown>;
export declare class WriteJsonFileErrorTooManyOpenFiles extends WriteJsonFileErrorTooManyOpenFiles_base {
}
declare const WriteJsonFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-busy", unknown>>, unknown>;
export declare class WriteJsonFileErrorBusy extends WriteJsonFileErrorBusy_base {
}
declare const WriteJsonFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-json-file-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-json-file-error", unknown>>, unknown>;
export declare class WriteJsonFileError extends WriteJsonFileError_base {
}
export type WriteJsonFileErrors = (WriteJsonFileErrorNotFound | WriteJsonFileErrorPermissionDenied | WriteJsonFileErrorIsDirectory | WriteJsonFileErrorNotDirectory | WriteJsonFileErrorNoSpace | WriteJsonFileErrorReadOnly | WriteJsonFileErrorInvalidArgument | WriteJsonFileErrorTooManyOpenFiles | WriteJsonFileErrorBusy | WriteJsonFileError);
export type WriteJsonFileResult = (DEither.Right<"file-system-write-json-file", void> | DEither.Left<"file-system-write-json-file-error", WriteJsonFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        writeJsonFile(path: DPath.AnyPath, data: unknown, params?: WriteJsonFileParams): Promise<WriteJsonFileResult>;
    }
}
export declare function writeJsonFile(data: unknown): (path: DPath.AnyPath) => Promise<WriteJsonFileResult>;
export declare function writeJsonFile(path: DPath.AnyPath, data: unknown, params?: WriteJsonFileParams): Promise<WriteJsonFileResult>;
export {};
