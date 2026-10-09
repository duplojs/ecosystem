import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export interface SetOwnerParams {
    userId: number;
    groupId: number;
}
declare const SetOwnerErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-not-found", unknown>>, unknown>;
declare class SetOwnerErrorNotFound extends SetOwnerErrorNotFound_base {
}
declare const SetOwnerErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-permission-denied", unknown>>, unknown>;
declare class SetOwnerErrorPermissionDenied extends SetOwnerErrorPermissionDenied_base {
}
declare const SetOwnerErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-not-directory", unknown>>, unknown>;
declare class SetOwnerErrorNotDirectory extends SetOwnerErrorNotDirectory_base {
}
declare const SetOwnerErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-read-only", unknown>>, unknown>;
declare class SetOwnerErrorReadOnly extends SetOwnerErrorReadOnly_base {
}
declare const SetOwnerErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-invalid-argument", unknown>>, unknown>;
declare class SetOwnerErrorInvalidArgument extends SetOwnerErrorInvalidArgument_base {
}
declare const SetOwnerError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-set-owner-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-set-owner-error", unknown>>, unknown>;
declare class SetOwnerError extends SetOwnerError_base {
}
export type SetOwnerErrors = (SetOwnerErrorNotFound | SetOwnerErrorPermissionDenied | SetOwnerErrorNotDirectory | SetOwnerErrorReadOnly | SetOwnerErrorInvalidArgument | SetOwnerError);
export type SetOwnerResult = (DEither.Right<"file-system-set-owner", void> | DEither.Left<"file-system-set-owner-error", SetOwnerErrors>);
declare module '../implementor' {
    interface ServerFunction {
        setOwner(path: string & DPath.Path, params: SetOwnerParams): Promise<SetOwnerResult>;
    }
}
export declare function setOwner(params: SetOwnerParams): (path: string & DPath.Path) => Promise<SetOwnerResult>;
export declare function setOwner(path: string & DPath.Path, params: SetOwnerParams): Promise<SetOwnerResult>;
export {};
