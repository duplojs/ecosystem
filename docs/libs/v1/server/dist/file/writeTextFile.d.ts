import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare const WriteTextFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-not-found", unknown>>, unknown>;
declare class WriteTextFileErrorNotFound extends WriteTextFileErrorNotFound_base {
}
declare const WriteTextFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-permission-denied", unknown>>, unknown>;
declare class WriteTextFileErrorPermissionDenied extends WriteTextFileErrorPermissionDenied_base {
}
declare const WriteTextFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-is-directory", unknown>>, unknown>;
declare class WriteTextFileErrorIsDirectory extends WriteTextFileErrorIsDirectory_base {
}
declare const WriteTextFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-not-directory", unknown>>, unknown>;
declare class WriteTextFileErrorNotDirectory extends WriteTextFileErrorNotDirectory_base {
}
declare const WriteTextFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-no-space", unknown>>, unknown>;
declare class WriteTextFileErrorNoSpace extends WriteTextFileErrorNoSpace_base {
}
declare const WriteTextFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-read-only", unknown>>, unknown>;
declare class WriteTextFileErrorReadOnly extends WriteTextFileErrorReadOnly_base {
}
declare const WriteTextFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-invalid-argument", unknown>>, unknown>;
declare class WriteTextFileErrorInvalidArgument extends WriteTextFileErrorInvalidArgument_base {
}
declare const WriteTextFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-too-many-open-files", unknown>>, unknown>;
declare class WriteTextFileErrorTooManyOpenFiles extends WriteTextFileErrorTooManyOpenFiles_base {
}
declare const WriteTextFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-busy", unknown>>, unknown>;
declare class WriteTextFileErrorBusy extends WriteTextFileErrorBusy_base {
}
declare const WriteTextFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-write-text-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-write-text-file-error", unknown>>, unknown>;
declare class WriteTextFileError extends WriteTextFileError_base {
}
export type WriteTextFileErrors = (WriteTextFileErrorNotFound | WriteTextFileErrorPermissionDenied | WriteTextFileErrorIsDirectory | WriteTextFileErrorNotDirectory | WriteTextFileErrorNoSpace | WriteTextFileErrorReadOnly | WriteTextFileErrorInvalidArgument | WriteTextFileErrorTooManyOpenFiles | WriteTextFileErrorBusy | WriteTextFileError);
export type WriteTextFileResult = (DEither.Right<"file-system-write-text-file", void> | DEither.Left<"file-system-write-text-file-error", WriteTextFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        writeTextFile(path: string & DPath.Path, data: string): Promise<WriteTextFileResult>;
    }
}
export declare function writeTextFile(data: string): (path: string & DPath.Path) => Promise<WriteTextFileResult>;
export declare function writeTextFile(path: string & DPath.Path, data: string): Promise<WriteTextFileResult>;
export {};
