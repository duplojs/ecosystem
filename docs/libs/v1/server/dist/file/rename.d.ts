import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
declare const RenameErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-not-found", unknown>>, unknown>;
export declare class RenameErrorNotFound extends RenameErrorNotFound_base {
}
declare const RenameErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-permission-denied", unknown>>, unknown>;
export declare class RenameErrorPermissionDenied extends RenameErrorPermissionDenied_base {
}
declare const RenameErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-already-exists", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-already-exists", unknown>>, unknown>;
export declare class RenameErrorAlreadyExists extends RenameErrorAlreadyExists_base {
}
declare const RenameErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-is-directory", unknown>>, unknown>;
export declare class RenameErrorIsDirectory extends RenameErrorIsDirectory_base {
}
declare const RenameErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-not-directory", unknown>>, unknown>;
export declare class RenameErrorNotDirectory extends RenameErrorNotDirectory_base {
}
declare const RenameErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-directory-not-empty", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-directory-not-empty", unknown>>, unknown>;
export declare class RenameErrorDirectoryNotEmpty extends RenameErrorDirectoryNotEmpty_base {
}
declare const RenameErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-read-only", unknown>>, unknown>;
export declare class RenameErrorReadOnly extends RenameErrorReadOnly_base {
}
declare const RenameErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-invalid-argument", unknown>>, unknown>;
export declare class RenameErrorInvalidArgument extends RenameErrorInvalidArgument_base {
}
declare const RenameErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-busy", unknown>>, unknown>;
export declare class RenameErrorBusy extends RenameErrorBusy_base {
}
declare const RenameErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-cross-device", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-cross-device", unknown>>, unknown>;
export declare class RenameErrorCrossDevice extends RenameErrorCrossDevice_base {
}
declare const RenameError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-error", unknown>>, unknown>;
export declare class RenameError extends RenameError_base {
}
export type RenameErrors = (RenameErrorNotFound | RenameErrorPermissionDenied | RenameErrorAlreadyExists | RenameErrorIsDirectory | RenameErrorNotDirectory | RenameErrorDirectoryNotEmpty | RenameErrorReadOnly | RenameErrorInvalidArgument | RenameErrorBusy | RenameErrorCrossDevice | RenameError);
export type RenameResult = (DEither.Right<"file-system-rename", string & DPath.Path> | DEither.Left<"file-system-rename-error", RenameErrors>);
declare module '../implementor' {
    interface ServerFunction {
        rename(path: DPath.AnyPath, newName: string & DPath.Segment): Promise<RenameResult>;
    }
}
export declare function rename(newName: string & DPath.Segment): (path: DPath.AnyPath) => Promise<RenameResult>;
export declare function rename(path: DPath.AnyPath, newName: string & DPath.Segment): Promise<RenameResult>;
export {};
