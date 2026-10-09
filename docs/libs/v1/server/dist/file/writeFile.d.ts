import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare const WriteFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-not-found", unknown>>, unknown>;
declare class WriteFileErrorNotFound extends WriteFileErrorNotFound_base {
}
declare const WriteFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-permission-denied", unknown>>, unknown>;
declare class WriteFileErrorPermissionDenied extends WriteFileErrorPermissionDenied_base {
}
declare const WriteFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-is-directory", unknown>>, unknown>;
declare class WriteFileErrorIsDirectory extends WriteFileErrorIsDirectory_base {
}
declare const WriteFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-not-directory", unknown>>, unknown>;
declare class WriteFileErrorNotDirectory extends WriteFileErrorNotDirectory_base {
}
declare const WriteFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-no-space", unknown>>, unknown>;
declare class WriteFileErrorNoSpace extends WriteFileErrorNoSpace_base {
}
declare const WriteFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-read-only", unknown>>, unknown>;
declare class WriteFileErrorReadOnly extends WriteFileErrorReadOnly_base {
}
declare const WriteFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-invalid-argument", unknown>>, unknown>;
declare class WriteFileErrorInvalidArgument extends WriteFileErrorInvalidArgument_base {
}
declare const WriteFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-too-many-open-files", unknown>>, unknown>;
declare class WriteFileErrorTooManyOpenFiles extends WriteFileErrorTooManyOpenFiles_base {
}
declare const WriteFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-busy", unknown>>, unknown>;
declare class WriteFileErrorBusy extends WriteFileErrorBusy_base {
}
declare const WriteFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-file-error", unknown>>, unknown>;
declare class WriteFileError extends WriteFileError_base {
}
export type WriteFileErrors = (WriteFileErrorNotFound | WriteFileErrorPermissionDenied | WriteFileErrorIsDirectory | WriteFileErrorNotDirectory | WriteFileErrorNoSpace | WriteFileErrorReadOnly | WriteFileErrorInvalidArgument | WriteFileErrorTooManyOpenFiles | WriteFileErrorBusy | WriteFileError);
export type WriteFileResult = (DEither.Right<"file-system-write-file", void> | DEither.Left<"file-system-write-file-error", WriteFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        writeFile(path: string & DPath.Path, data: Uint8Array): Promise<WriteFileResult>;
    }
}
export declare function writeFile(data: Uint8Array): (path: string & DPath.Path) => Promise<WriteFileResult>;
export declare function writeFile(path: string & DPath.Path, data: Uint8Array): Promise<WriteFileResult>;
export {};
