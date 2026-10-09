import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DCommon from "@duplojs-v1/lang/common";
declare const RelocateErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-not-found", unknown>>, unknown>;
declare class RelocateErrorNotFound extends RelocateErrorNotFound_base {
}
declare const RelocateErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-permission-denied", unknown>>, unknown>;
declare class RelocateErrorPermissionDenied extends RelocateErrorPermissionDenied_base {
}
declare const RelocateErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-already-exists", unknown>>, unknown>;
declare class RelocateErrorAlreadyExists extends RelocateErrorAlreadyExists_base {
}
declare const RelocateErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-is-directory", unknown>>, unknown>;
declare class RelocateErrorIsDirectory extends RelocateErrorIsDirectory_base {
}
declare const RelocateErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-not-directory", unknown>>, unknown>;
declare class RelocateErrorNotDirectory extends RelocateErrorNotDirectory_base {
}
declare const RelocateErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-directory-not-empty", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-directory-not-empty", unknown>>, unknown>;
declare class RelocateErrorDirectoryNotEmpty extends RelocateErrorDirectoryNotEmpty_base {
}
declare const RelocateErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-read-only", unknown>>, unknown>;
declare class RelocateErrorReadOnly extends RelocateErrorReadOnly_base {
}
declare const RelocateErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-invalid-argument", unknown>>, unknown>;
declare class RelocateErrorInvalidArgument extends RelocateErrorInvalidArgument_base {
}
declare const RelocateErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-busy", unknown>>, unknown>;
declare class RelocateErrorBusy extends RelocateErrorBusy_base {
}
declare const RelocateErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-cross-device", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-cross-device", unknown>>, unknown>;
declare class RelocateErrorCrossDevice extends RelocateErrorCrossDevice_base {
}
declare const RelocateError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-error", unknown>>, unknown>;
declare class RelocateError extends RelocateError_base {
}
export type RelocateErrors = (RelocateErrorNotFound | RelocateErrorPermissionDenied | RelocateErrorAlreadyExists | RelocateErrorIsDirectory | RelocateErrorNotDirectory | RelocateErrorDirectoryNotEmpty | RelocateErrorReadOnly | RelocateErrorInvalidArgument | RelocateErrorBusy | RelocateErrorCrossDevice | RelocateError);
export type RelocateResult = (DEither.Right<"file-system-relocate", string & DPath.Path> | DEither.Left<"file-system-relocate-error", RelocateErrors>);
declare module '../implementor' {
    interface ServerFunction {
        relocate(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<RelocateResult>;
    }
}
export declare function relocate(toPath: string & DPath.Path): (fromPath: string & DPath.Path) => Promise<RelocateResult>;
export declare function relocate(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<RelocateResult>;
export {};
