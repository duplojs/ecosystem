import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DCommon from "@duplojs-v1/lang/common";
declare const MoveErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-not-found", unknown>>, unknown>;
declare class MoveErrorNotFound extends MoveErrorNotFound_base {
}
declare const MoveErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-permission-denied", unknown>>, unknown>;
declare class MoveErrorPermissionDenied extends MoveErrorPermissionDenied_base {
}
declare const MoveErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-already-exists", unknown>>, unknown>;
declare class MoveErrorAlreadyExists extends MoveErrorAlreadyExists_base {
}
declare const MoveErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-is-directory", unknown>>, unknown>;
declare class MoveErrorIsDirectory extends MoveErrorIsDirectory_base {
}
declare const MoveErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-not-directory", unknown>>, unknown>;
declare class MoveErrorNotDirectory extends MoveErrorNotDirectory_base {
}
declare const MoveErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-directory-not-empty", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-directory-not-empty", unknown>>, unknown>;
declare class MoveErrorDirectoryNotEmpty extends MoveErrorDirectoryNotEmpty_base {
}
declare const MoveErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-read-only", unknown>>, unknown>;
declare class MoveErrorReadOnly extends MoveErrorReadOnly_base {
}
declare const MoveErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-invalid-argument", unknown>>, unknown>;
declare class MoveErrorInvalidArgument extends MoveErrorInvalidArgument_base {
}
declare const MoveErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-busy", unknown>>, unknown>;
declare class MoveErrorBusy extends MoveErrorBusy_base {
}
declare const MoveErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-cross-device", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-cross-device", unknown>>, unknown>;
declare class MoveErrorCrossDevice extends MoveErrorCrossDevice_base {
}
declare const MoveError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-error", unknown>>, unknown>;
declare class MoveError extends MoveError_base {
}
export type MoveErrors = (MoveErrorNotFound | MoveErrorPermissionDenied | MoveErrorAlreadyExists | MoveErrorIsDirectory | MoveErrorNotDirectory | MoveErrorDirectoryNotEmpty | MoveErrorReadOnly | MoveErrorInvalidArgument | MoveErrorBusy | MoveErrorCrossDevice | MoveError);
export type MoveResult = (DEither.Right<"file-system-move", void> | DEither.Left<"file-system-move-error", MoveErrors>);
declare module '../implementor' {
    interface ServerFunction {
        move(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<MoveResult>;
    }
}
export declare function move(toPath: string & DPath.Path): (fromPath: string & DPath.Path) => Promise<MoveResult>;
export declare function move(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<MoveResult>;
export {};
