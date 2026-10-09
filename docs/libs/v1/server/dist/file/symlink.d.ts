import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export interface SymlinkParams {
    /**
     * @remarks
     * Specify the symbolic link type as file, directory or NTFS junction.
     * This option only applies to Windows and is ignored on other operating systems.
     */
    type: "file" | "dir" | "junction";
}
declare const SymlinkErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-not-found", unknown>>, unknown>;
declare class SymlinkErrorNotFound extends SymlinkErrorNotFound_base {
}
declare const SymlinkErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-permission-denied", unknown>>, unknown>;
declare class SymlinkErrorPermissionDenied extends SymlinkErrorPermissionDenied_base {
}
declare const SymlinkErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-already-exists", unknown>>, unknown>;
declare class SymlinkErrorAlreadyExists extends SymlinkErrorAlreadyExists_base {
}
declare const SymlinkErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-not-directory", unknown>>, unknown>;
declare class SymlinkErrorNotDirectory extends SymlinkErrorNotDirectory_base {
}
declare const SymlinkErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-read-only", unknown>>, unknown>;
declare class SymlinkErrorReadOnly extends SymlinkErrorReadOnly_base {
}
declare const SymlinkErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-invalid-argument", unknown>>, unknown>;
declare class SymlinkErrorInvalidArgument extends SymlinkErrorInvalidArgument_base {
}
declare const SymlinkErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-too-many-open-files", unknown>>, unknown>;
declare class SymlinkErrorTooManyOpenFiles extends SymlinkErrorTooManyOpenFiles_base {
}
declare const SymlinkErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-busy", unknown>>, unknown>;
declare class SymlinkErrorBusy extends SymlinkErrorBusy_base {
}
declare const SymlinkError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-symlink-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-symlink-error", unknown>>, unknown>;
declare class SymlinkError extends SymlinkError_base {
}
export type SymlinkErrors = (SymlinkErrorNotFound | SymlinkErrorPermissionDenied | SymlinkErrorAlreadyExists | SymlinkErrorNotDirectory | SymlinkErrorReadOnly | SymlinkErrorInvalidArgument | SymlinkErrorTooManyOpenFiles | SymlinkErrorBusy | SymlinkError);
export type SymlinkResult = (DEither.Right<"file-system-symlink", void> | DEither.Left<"file-system-symlink-error", SymlinkErrors>);
declare module '../implementor' {
    interface ServerFunction {
        symlink(oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams): Promise<SymlinkResult>;
    }
}
export declare function symlink(newPath: string & DPath.Path): (oldPath: string & DPath.Path) => Promise<SymlinkResult>;
export declare function symlink(oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams): Promise<SymlinkResult>;
export {};
