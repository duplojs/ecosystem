import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const AppendFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-not-found", unknown>>, unknown>;
declare class AppendFileErrorNotFound extends AppendFileErrorNotFound_base {
}
declare const AppendFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-permission-denied", unknown>>, unknown>;
declare class AppendFileErrorPermissionDenied extends AppendFileErrorPermissionDenied_base {
}
declare const AppendFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-is-directory", unknown>>, unknown>;
declare class AppendFileErrorIsDirectory extends AppendFileErrorIsDirectory_base {
}
declare const AppendFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-not-directory", unknown>>, unknown>;
declare class AppendFileErrorNotDirectory extends AppendFileErrorNotDirectory_base {
}
declare const AppendFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-no-space", unknown>>, unknown>;
declare class AppendFileErrorNoSpace extends AppendFileErrorNoSpace_base {
}
declare const AppendFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-read-only", unknown>>, unknown>;
declare class AppendFileErrorReadOnly extends AppendFileErrorReadOnly_base {
}
declare const AppendFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-invalid-argument", unknown>>, unknown>;
declare class AppendFileErrorInvalidArgument extends AppendFileErrorInvalidArgument_base {
}
declare const AppendFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-too-many-open-files", unknown>>, unknown>;
declare class AppendFileErrorTooManyOpenFiles extends AppendFileErrorTooManyOpenFiles_base {
}
declare const AppendFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-busy", unknown>>, unknown>;
declare class AppendFileErrorBusy extends AppendFileErrorBusy_base {
}
declare const AppendFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-file-error", unknown>>, unknown>;
declare class AppendFileError extends AppendFileError_base {
}
export type AppendFileErrors = (AppendFileErrorNotFound | AppendFileErrorPermissionDenied | AppendFileErrorIsDirectory | AppendFileErrorNotDirectory | AppendFileErrorNoSpace | AppendFileErrorReadOnly | AppendFileErrorInvalidArgument | AppendFileErrorTooManyOpenFiles | AppendFileErrorBusy | AppendFileError);
export type AppendFileResult = (DEither.Right<"file-system-append-file", void> | DEither.Left<"file-system-append-file-error", AppendFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        appendFile(path: string & DPath.Path, data: Uint8Array): Promise<AppendFileResult>;
    }
}
export declare function appendFile(data: Uint8Array): (path: string & DPath.Path) => Promise<AppendFileResult>;
export declare function appendFile(path: string & DPath.Path, data: Uint8Array): Promise<AppendFileResult>;
export {};
