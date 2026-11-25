import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
interface SetTimeParams {
    accessTime: DChrono.TheDate;
    modifiedTime: DChrono.TheDate;
}
declare const SetTimeErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-not-found", unknown>>, unknown>;
export declare class SetTimeErrorNotFound extends SetTimeErrorNotFound_base {
}
declare const SetTimeErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-permission-denied", unknown>>, unknown>;
export declare class SetTimeErrorPermissionDenied extends SetTimeErrorPermissionDenied_base {
}
declare const SetTimeErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-not-directory", unknown>>, unknown>;
export declare class SetTimeErrorNotDirectory extends SetTimeErrorNotDirectory_base {
}
declare const SetTimeErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-read-only", unknown>>, unknown>;
export declare class SetTimeErrorReadOnly extends SetTimeErrorReadOnly_base {
}
declare const SetTimeErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-invalid-argument", unknown>>, unknown>;
export declare class SetTimeErrorInvalidArgument extends SetTimeErrorInvalidArgument_base {
}
declare const SetTimeError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-time-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-time-error", unknown>>, unknown>;
export declare class SetTimeError extends SetTimeError_base {
}
export type SetTimeErrors = (SetTimeErrorNotFound | SetTimeErrorPermissionDenied | SetTimeErrorNotDirectory | SetTimeErrorReadOnly | SetTimeErrorInvalidArgument | SetTimeError);
export type SetTimeResult = (DEither.Right<"file-system-set-time", void> | DEither.Left<"file-system-set-time-error", SetTimeErrors>);
declare module '../implementor' {
    interface ServerFunction {
        setTime(path: DPath.AnyPath, params: SetTimeParams): Promise<SetTimeResult>;
    }
}
export declare function setTime(params: SetTimeParams): (path: DPath.AnyPath) => Promise<SetTimeResult>;
export declare function setTime(path: DPath.AnyPath, params: SetTimeParams): Promise<SetTimeResult>;
export {};
