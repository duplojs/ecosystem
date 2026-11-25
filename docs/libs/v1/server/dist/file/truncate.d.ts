import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
declare const TruncateErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-not-found", unknown>>, unknown>;
export declare class TruncateErrorNotFound extends TruncateErrorNotFound_base {
}
declare const TruncateErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-permission-denied", unknown>>, unknown>;
export declare class TruncateErrorPermissionDenied extends TruncateErrorPermissionDenied_base {
}
declare const TruncateErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-is-directory", unknown>>, unknown>;
export declare class TruncateErrorIsDirectory extends TruncateErrorIsDirectory_base {
}
declare const TruncateErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-not-directory", unknown>>, unknown>;
export declare class TruncateErrorNotDirectory extends TruncateErrorNotDirectory_base {
}
declare const TruncateErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-no-space", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-no-space", unknown>>, unknown>;
export declare class TruncateErrorNoSpace extends TruncateErrorNoSpace_base {
}
declare const TruncateErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-read-only", unknown>>, unknown>;
export declare class TruncateErrorReadOnly extends TruncateErrorReadOnly_base {
}
declare const TruncateErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-invalid-argument", unknown>>, unknown>;
export declare class TruncateErrorInvalidArgument extends TruncateErrorInvalidArgument_base {
}
declare const TruncateErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-too-many-open-files", unknown>>, unknown>;
export declare class TruncateErrorTooManyOpenFiles extends TruncateErrorTooManyOpenFiles_base {
}
declare const TruncateErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-busy", unknown>>, unknown>;
export declare class TruncateErrorBusy extends TruncateErrorBusy_base {
}
declare const TruncateError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-truncate-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-truncate-error", unknown>>, unknown>;
export declare class TruncateError extends TruncateError_base {
}
export type TruncateErrors = (TruncateErrorNotFound | TruncateErrorPermissionDenied | TruncateErrorIsDirectory | TruncateErrorNotDirectory | TruncateErrorNoSpace | TruncateErrorReadOnly | TruncateErrorInvalidArgument | TruncateErrorTooManyOpenFiles | TruncateErrorBusy | TruncateError);
export type TruncateResult = (DEither.Right<"file-system-truncate", void> | DEither.Left<"file-system-truncate-error", TruncateErrors>);
declare module '../implementor' {
    interface ServerFunction {
        truncate(path: DPath.AnyPath, size?: number): Promise<TruncateResult>;
    }
}
export declare const truncate: (path: DPath.AnyPath, size?: number) => Promise<TruncateResult>;
export {};
