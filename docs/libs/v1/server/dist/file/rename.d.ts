import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DCommon from "@duplojs-v1/lang/common";
declare const RenameErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-not-found", unknown>>, unknown>;
declare class RenameErrorNotFound extends RenameErrorNotFound_base {
}
declare const RenameErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-permission-denied", unknown>>, unknown>;
declare class RenameErrorPermissionDenied extends RenameErrorPermissionDenied_base {
}
declare const RenameErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-already-exists", unknown>>, unknown>;
declare class RenameErrorAlreadyExists extends RenameErrorAlreadyExists_base {
}
declare const RenameErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-is-directory", unknown>>, unknown>;
declare class RenameErrorIsDirectory extends RenameErrorIsDirectory_base {
}
declare const RenameErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-not-directory", unknown>>, unknown>;
declare class RenameErrorNotDirectory extends RenameErrorNotDirectory_base {
}
declare const RenameErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-directory-not-empty", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-directory-not-empty", unknown>>, unknown>;
declare class RenameErrorDirectoryNotEmpty extends RenameErrorDirectoryNotEmpty_base {
}
declare const RenameErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-read-only", unknown>>, unknown>;
declare class RenameErrorReadOnly extends RenameErrorReadOnly_base {
}
declare const RenameErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-invalid-argument", unknown>>, unknown>;
declare class RenameErrorInvalidArgument extends RenameErrorInvalidArgument_base {
}
declare const RenameErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-busy", unknown>>, unknown>;
declare class RenameErrorBusy extends RenameErrorBusy_base {
}
declare const RenameErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-cross-device", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-cross-device", unknown>>, unknown>;
declare class RenameErrorCrossDevice extends RenameErrorCrossDevice_base {
}
declare const RenameError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-rename-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-rename-error", unknown>>, unknown>;
declare class RenameError extends RenameError_base {
}
export type RenameErrors = (RenameErrorNotFound | RenameErrorPermissionDenied | RenameErrorAlreadyExists | RenameErrorIsDirectory | RenameErrorNotDirectory | RenameErrorDirectoryNotEmpty | RenameErrorReadOnly | RenameErrorInvalidArgument | RenameErrorBusy | RenameErrorCrossDevice | RenameError);
export type RenameResult = (DEither.Right<"file-system-rename", string & DPath.Path> | DEither.Left<"file-system-rename-error", RenameErrors>);
declare module '../implementor' {
    interface ServerFunction {
        rename(path: string & DPath.Path, newName: string & DPath.Segment): Promise<RenameResult>;
    }
}
export declare function rename(newName: string & DPath.Segment): (path: string & DPath.Path) => Promise<RenameResult>;
export declare function rename(path: string & DPath.Path, newName: string & DPath.Segment): Promise<RenameResult>;
export {};
