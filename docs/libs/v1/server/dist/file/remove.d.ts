import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
interface RemoveDirectoryParams {
    recursive?: boolean;
}
declare const RemoveErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-not-found", unknown>>, unknown>;
export declare class RemoveErrorNotFound extends RemoveErrorNotFound_base {
}
declare const RemoveErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-permission-denied", unknown>>, unknown>;
export declare class RemoveErrorPermissionDenied extends RemoveErrorPermissionDenied_base {
}
declare const RemoveErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-is-directory", unknown>>, unknown>;
export declare class RemoveErrorIsDirectory extends RemoveErrorIsDirectory_base {
}
declare const RemoveErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-not-directory", unknown>>, unknown>;
export declare class RemoveErrorNotDirectory extends RemoveErrorNotDirectory_base {
}
declare const RemoveErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-directory-not-empty", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-directory-not-empty", unknown>>, unknown>;
export declare class RemoveErrorDirectoryNotEmpty extends RemoveErrorDirectoryNotEmpty_base {
}
declare const RemoveErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-read-only", unknown>>, unknown>;
export declare class RemoveErrorReadOnly extends RemoveErrorReadOnly_base {
}
declare const RemoveErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-invalid-argument", unknown>>, unknown>;
export declare class RemoveErrorInvalidArgument extends RemoveErrorInvalidArgument_base {
}
declare const RemoveErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-busy", unknown>>, unknown>;
export declare class RemoveErrorBusy extends RemoveErrorBusy_base {
}
declare const RemoveError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-remove-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-remove-error", unknown>>, unknown>;
export declare class RemoveError extends RemoveError_base {
}
export type RemoveErrors = (RemoveErrorNotFound | RemoveErrorPermissionDenied | RemoveErrorIsDirectory | RemoveErrorNotDirectory | RemoveErrorDirectoryNotEmpty | RemoveErrorReadOnly | RemoveErrorInvalidArgument | RemoveErrorBusy | RemoveError);
export type RemoveResult = (DEither.Right<"file-system-remove", void> | DEither.Left<"file-system-remove-error", RemoveErrors>);
declare module '../implementor' {
    interface ServerFunction {
        remove(path: DPath.AnyPath, params?: RemoveDirectoryParams): Promise<RemoveResult>;
    }
}
export declare const remove: (path: DPath.AnyPath, params?: RemoveDirectoryParams) => Promise<RemoveResult>;
export {};
