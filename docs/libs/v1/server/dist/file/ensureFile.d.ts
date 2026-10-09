import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const EnsureFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-permission-denied", unknown>>, unknown>;
declare class EnsureFileErrorPermissionDenied extends EnsureFileErrorPermissionDenied_base {
}
declare const EnsureFileErrorIsDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-is-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-is-directory", unknown>>, unknown>;
declare class EnsureFileErrorIsDirectory extends EnsureFileErrorIsDirectory_base {
}
declare const EnsureFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-not-directory", unknown>>, unknown>;
declare class EnsureFileErrorNotDirectory extends EnsureFileErrorNotDirectory_base {
}
declare const EnsureFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-no-space", unknown>>, unknown>;
declare class EnsureFileErrorNoSpace extends EnsureFileErrorNoSpace_base {
}
declare const EnsureFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-read-only", unknown>>, unknown>;
declare class EnsureFileErrorReadOnly extends EnsureFileErrorReadOnly_base {
}
declare const EnsureFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-invalid-argument", unknown>>, unknown>;
declare class EnsureFileErrorInvalidArgument extends EnsureFileErrorInvalidArgument_base {
}
declare const EnsureFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-too-many-open-files", unknown>>, unknown>;
declare class EnsureFileErrorTooManyOpenFiles extends EnsureFileErrorTooManyOpenFiles_base {
}
declare const EnsureFileErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-busy", unknown>>, unknown>;
declare class EnsureFileErrorBusy extends EnsureFileErrorBusy_base {
}
declare const EnsureFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-file-error", unknown>>, unknown>;
declare class EnsureFileError extends EnsureFileError_base {
}
export type EnsureFileErrors = (EnsureFileErrorPermissionDenied | EnsureFileErrorIsDirectory | EnsureFileErrorNotDirectory | EnsureFileErrorNoSpace | EnsureFileErrorReadOnly | EnsureFileErrorInvalidArgument | EnsureFileErrorTooManyOpenFiles | EnsureFileErrorBusy | EnsureFileError);
export type EnsureFileResult = (DEither.Right<"file-system-ensure-file", void> | DEither.Left<"file-system-ensure-file-error", EnsureFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        ensureFile(path: string & DPath.Path): Promise<EnsureFileResult>;
    }
}
export declare const ensureFile: (path: string & DPath.Path) => Promise<EnsureFileResult>;
export {};
