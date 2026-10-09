import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const AppendTextFileErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-not-found", unknown>>, unknown>;
declare class AppendTextFileErrorNotFound extends AppendTextFileErrorNotFound_base {
}
declare const AppendTextFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-permission-denied", unknown>>, unknown>;
declare class AppendTextFileErrorPermissionDenied extends AppendTextFileErrorPermissionDenied_base {
}
declare const AppendTextFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-is-directory", unknown>>, unknown>;
declare class AppendTextFileErrorIsDirectory extends AppendTextFileErrorIsDirectory_base {
}
declare const AppendTextFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-not-directory", unknown>>, unknown>;
declare class AppendTextFileErrorNotDirectory extends AppendTextFileErrorNotDirectory_base {
}
declare const AppendTextFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-no-space", unknown>>, unknown>;
declare class AppendTextFileErrorNoSpace extends AppendTextFileErrorNoSpace_base {
}
declare const AppendTextFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-read-only", unknown>>, unknown>;
declare class AppendTextFileErrorReadOnly extends AppendTextFileErrorReadOnly_base {
}
declare const AppendTextFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-invalid-argument", unknown>>, unknown>;
declare class AppendTextFileErrorInvalidArgument extends AppendTextFileErrorInvalidArgument_base {
}
declare const AppendTextFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-too-many-open-files", unknown>>, unknown>;
declare class AppendTextFileErrorTooManyOpenFiles extends AppendTextFileErrorTooManyOpenFiles_base {
}
declare const AppendTextFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-busy", unknown>>, unknown>;
declare class AppendTextFileErrorBusy extends AppendTextFileErrorBusy_base {
}
declare const AppendTextFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-append-text-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-append-text-file-error", unknown>>, unknown>;
declare class AppendTextFileError extends AppendTextFileError_base {
}
export type AppendTextFileErrors = (AppendTextFileErrorNotFound | AppendTextFileErrorPermissionDenied | AppendTextFileErrorIsDirectory | AppendTextFileErrorNotDirectory | AppendTextFileErrorNoSpace | AppendTextFileErrorReadOnly | AppendTextFileErrorInvalidArgument | AppendTextFileErrorTooManyOpenFiles | AppendTextFileErrorBusy | AppendTextFileError);
export type AppendTextFileResult = (DEither.Right<"file-system-append-text-file", void> | DEither.Left<"file-system-append-text-file-error", AppendTextFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        appendTextFile(path: string & DPath.Path, data: string): Promise<AppendTextFileResult>;
    }
}
export declare function appendTextFile(data: string): (path: string & DPath.Path) => Promise<AppendTextFileResult>;
export declare function appendTextFile(path: string & DPath.Path, data: string): Promise<AppendTextFileResult>;
export {};
