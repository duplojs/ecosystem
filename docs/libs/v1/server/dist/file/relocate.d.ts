import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
declare const RelocateErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-not-found", unknown>>, unknown>;
export declare class RelocateErrorNotFound extends RelocateErrorNotFound_base {
}
declare const RelocateErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-permission-denied", unknown>>, unknown>;
export declare class RelocateErrorPermissionDenied extends RelocateErrorPermissionDenied_base {
}
declare const RelocateErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-already-exists", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-already-exists", unknown>>, unknown>;
export declare class RelocateErrorAlreadyExists extends RelocateErrorAlreadyExists_base {
}
declare const RelocateErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-is-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-is-directory", unknown>>, unknown>;
export declare class RelocateErrorIsDirectory extends RelocateErrorIsDirectory_base {
}
declare const RelocateErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-not-directory", unknown>>, unknown>;
export declare class RelocateErrorNotDirectory extends RelocateErrorNotDirectory_base {
}
declare const RelocateErrorDirectoryNotEmpty_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-directory-not-empty", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-directory-not-empty", unknown>>, unknown>;
export declare class RelocateErrorDirectoryNotEmpty extends RelocateErrorDirectoryNotEmpty_base {
}
declare const RelocateErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-read-only", unknown>>, unknown>;
export declare class RelocateErrorReadOnly extends RelocateErrorReadOnly_base {
}
declare const RelocateErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-invalid-argument", unknown>>, unknown>;
export declare class RelocateErrorInvalidArgument extends RelocateErrorInvalidArgument_base {
}
declare const RelocateErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-busy", unknown>>, unknown>;
export declare class RelocateErrorBusy extends RelocateErrorBusy_base {
}
declare const RelocateErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-cross-device", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-cross-device", unknown>>, unknown>;
export declare class RelocateErrorCrossDevice extends RelocateErrorCrossDevice_base {
}
declare const RelocateError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-relocate-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-relocate-error", unknown>>, unknown>;
export declare class RelocateError extends RelocateError_base {
}
export type RelocateErrors = (RelocateErrorNotFound | RelocateErrorPermissionDenied | RelocateErrorAlreadyExists | RelocateErrorIsDirectory | RelocateErrorNotDirectory | RelocateErrorDirectoryNotEmpty | RelocateErrorReadOnly | RelocateErrorInvalidArgument | RelocateErrorBusy | RelocateErrorCrossDevice | RelocateError);
export type RelocateResult = (DEither.Right<"file-system-relocate", string & DPath.Path> | DEither.Left<"file-system-relocate-error", RelocateErrors>);
declare module '../implementor' {
    interface ServerFunction {
        relocate(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<RelocateResult>;
    }
}
export declare function relocate(toPath: DPath.AnyPath): (fromPath: DPath.AnyPath) => Promise<RelocateResult>;
export declare function relocate(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<RelocateResult>;
export {};
