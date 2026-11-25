import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
export interface SymlinkParams {
    type: "file" | "directory" | "junction";
}
declare const SymlinkErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-not-found", unknown>>, unknown>;
export declare class SymlinkErrorNotFound extends SymlinkErrorNotFound_base {
}
declare const SymlinkErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-permission-denied", unknown>>, unknown>;
export declare class SymlinkErrorPermissionDenied extends SymlinkErrorPermissionDenied_base {
}
declare const SymlinkErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-already-exists", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-already-exists", unknown>>, unknown>;
export declare class SymlinkErrorAlreadyExists extends SymlinkErrorAlreadyExists_base {
}
declare const SymlinkErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-not-directory", unknown>>, unknown>;
export declare class SymlinkErrorNotDirectory extends SymlinkErrorNotDirectory_base {
}
declare const SymlinkErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-read-only", unknown>>, unknown>;
export declare class SymlinkErrorReadOnly extends SymlinkErrorReadOnly_base {
}
declare const SymlinkErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-invalid-argument", unknown>>, unknown>;
export declare class SymlinkErrorInvalidArgument extends SymlinkErrorInvalidArgument_base {
}
declare const SymlinkErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-too-many-open-files", unknown>>, unknown>;
export declare class SymlinkErrorTooManyOpenFiles extends SymlinkErrorTooManyOpenFiles_base {
}
declare const SymlinkErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-busy", unknown>>, unknown>;
export declare class SymlinkErrorBusy extends SymlinkErrorBusy_base {
}
declare const SymlinkError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-error", unknown>>, unknown>;
export declare class SymlinkError extends SymlinkError_base {
}
export type SymlinkErrors = (SymlinkErrorNotFound | SymlinkErrorPermissionDenied | SymlinkErrorAlreadyExists | SymlinkErrorNotDirectory | SymlinkErrorReadOnly | SymlinkErrorInvalidArgument | SymlinkErrorTooManyOpenFiles | SymlinkErrorBusy | SymlinkError);
export type SymlinkResult = (DEither.Right<"file-system-symlink", void> | DEither.Left<"file-system-symlink-error", SymlinkErrors>);
declare module '../implementor' {
    interface ServerFunction {
        symlink(oldPath: DPath.AnyPath, newPath: DPath.AnyPath, params?: SymlinkParams): Promise<SymlinkResult>;
    }
}
export declare function symlink(newPath: DPath.AnyPath): (oldPath: DPath.AnyPath) => Promise<SymlinkResult>;
export declare function symlink(oldPath: DPath.AnyPath, newPath: DPath.AnyPath, params?: SymlinkParams): Promise<SymlinkResult>;
export {};
