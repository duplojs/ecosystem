import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface Permissions {
    read?: boolean;
    write?: boolean;
    exec?: boolean;
}
interface ModeObject {
    user?: Permissions;
    group?: Permissions;
    other?: Permissions;
    setUserId?: boolean;
    setGroupId?: boolean;
    sticky?: boolean;
}
type SetMode = ModeObject | number;
declare const SetModeErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-not-found", unknown>>, unknown>;
declare class SetModeErrorNotFound extends SetModeErrorNotFound_base {
}
declare const SetModeErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-permission-denied", unknown>>, unknown>;
declare class SetModeErrorPermissionDenied extends SetModeErrorPermissionDenied_base {
}
declare const SetModeErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-not-directory", unknown>>, unknown>;
declare class SetModeErrorNotDirectory extends SetModeErrorNotDirectory_base {
}
declare const SetModeErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-read-only", unknown>>, unknown>;
declare class SetModeErrorReadOnly extends SetModeErrorReadOnly_base {
}
declare const SetModeErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-invalid-argument", unknown>>, unknown>;
declare class SetModeErrorInvalidArgument extends SetModeErrorInvalidArgument_base {
}
declare const SetModeError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-mode-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-mode-error", unknown>>, unknown>;
declare class SetModeError extends SetModeError_base {
}
export type SetModeErrors = (SetModeErrorNotFound | SetModeErrorPermissionDenied | SetModeErrorNotDirectory | SetModeErrorReadOnly | SetModeErrorInvalidArgument | SetModeError);
export type SetModeResult = (DEither.Right<"file-system-set-mode", void> | DEither.Left<"file-system-set-mode-error", SetModeErrors>);
declare module '../implementor' {
    interface ServerFunction {
        setMode(path: string & DPath.Path, mode: SetMode): Promise<SetModeResult>;
    }
}
export declare function setMode(mode: SetMode): (path: string & DPath.Path) => Promise<SetModeResult>;
export declare function setMode(path: string & DPath.Path, mode: SetMode): Promise<SetModeResult>;
export {};
