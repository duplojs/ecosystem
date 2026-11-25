import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
declare const MoveErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-not-found", unknown>>, unknown>;
export declare class MoveErrorNotFound extends MoveErrorNotFound_base {
}
declare const MoveErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-permission-denied", unknown>>, unknown>;
export declare class MoveErrorPermissionDenied extends MoveErrorPermissionDenied_base {
}
declare const MoveErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-already-exists", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-already-exists", unknown>>, unknown>;
export declare class MoveErrorAlreadyExists extends MoveErrorAlreadyExists_base {
}
declare const MoveErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-is-directory", unknown>>, unknown>;
export declare class MoveErrorIsDirectory extends MoveErrorIsDirectory_base {
}
declare const MoveErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-not-directory", unknown>>, unknown>;
export declare class MoveErrorNotDirectory extends MoveErrorNotDirectory_base {
}
declare const MoveErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-directory-not-empty", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-directory-not-empty", unknown>>, unknown>;
export declare class MoveErrorDirectoryNotEmpty extends MoveErrorDirectoryNotEmpty_base {
}
declare const MoveErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-read-only", unknown>>, unknown>;
export declare class MoveErrorReadOnly extends MoveErrorReadOnly_base {
}
declare const MoveErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-invalid-argument", unknown>>, unknown>;
export declare class MoveErrorInvalidArgument extends MoveErrorInvalidArgument_base {
}
declare const MoveErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-busy", unknown>>, unknown>;
export declare class MoveErrorBusy extends MoveErrorBusy_base {
}
declare const MoveErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-cross-device", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-cross-device", unknown>>, unknown>;
export declare class MoveErrorCrossDevice extends MoveErrorCrossDevice_base {
}
declare const MoveError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-move-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-move-error", unknown>>, unknown>;
export declare class MoveError extends MoveError_base {
}
export type MoveErrors = (MoveErrorNotFound | MoveErrorPermissionDenied | MoveErrorAlreadyExists | MoveErrorIsDirectory | MoveErrorNotDirectory | MoveErrorDirectoryNotEmpty | MoveErrorReadOnly | MoveErrorInvalidArgument | MoveErrorBusy | MoveErrorCrossDevice | MoveError);
export type MoveResult = (DEither.Right<"file-system-move", void> | DEither.Left<"file-system-move-error", MoveErrors>);
declare module '../implementor' {
    interface ServerFunction {
        move(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<MoveResult>;
    }
}
export declare function move(toPath: DPath.AnyPath): (fromPath: DPath.AnyPath) => Promise<MoveResult>;
export declare function move(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<MoveResult>;
export {};
