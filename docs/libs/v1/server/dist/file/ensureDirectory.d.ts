import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const EnsureDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-permission-denied", unknown>>, unknown>;
declare class EnsureDirectoryErrorPermissionDenied extends EnsureDirectoryErrorPermissionDenied_base {
}
declare const EnsureDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-not-directory", unknown>>, unknown>;
declare class EnsureDirectoryErrorNotDirectory extends EnsureDirectoryErrorNotDirectory_base {
}
declare const EnsureDirectoryErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-no-space", unknown>>, unknown>;
declare class EnsureDirectoryErrorNoSpace extends EnsureDirectoryErrorNoSpace_base {
}
declare const EnsureDirectoryErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-read-only", unknown>>, unknown>;
declare class EnsureDirectoryErrorReadOnly extends EnsureDirectoryErrorReadOnly_base {
}
declare const EnsureDirectoryErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-invalid-argument", unknown>>, unknown>;
declare class EnsureDirectoryErrorInvalidArgument extends EnsureDirectoryErrorInvalidArgument_base {
}
declare const EnsureDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-too-many-open-files", unknown>>, unknown>;
declare class EnsureDirectoryErrorTooManyOpenFiles extends EnsureDirectoryErrorTooManyOpenFiles_base {
}
declare const EnsureDirectoryErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-busy", unknown>>, unknown>;
declare class EnsureDirectoryErrorBusy extends EnsureDirectoryErrorBusy_base {
}
declare const EnsureDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-ensure-directory-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-ensure-directory-error", unknown>>, unknown>;
declare class EnsureDirectoryError extends EnsureDirectoryError_base {
}
type EnsureDirectoryErrors = (EnsureDirectoryErrorPermissionDenied | EnsureDirectoryErrorNotDirectory | EnsureDirectoryErrorNoSpace | EnsureDirectoryErrorReadOnly | EnsureDirectoryErrorInvalidArgument | EnsureDirectoryErrorTooManyOpenFiles | EnsureDirectoryErrorBusy | EnsureDirectoryError);
export type EnsureDirectoryResult = (DEither.Right<"file-system-ensure-directory", void> | DEither.Left<"file-system-ensure-directory-error", EnsureDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        ensureDirectory(path: string & DPath.Path): Promise<EnsureDirectoryResult>;
    }
}
export declare const ensureDirectory: (path: string & DPath.Path) => Promise<EnsureDirectoryResult>;
export {};
