import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
interface MakeDirectoryParams {
    recursive?: boolean;
}
declare const MakeDirectoryErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-not-found", unknown>>, unknown>;
declare class MakeDirectoryErrorNotFound extends MakeDirectoryErrorNotFound_base {
}
declare const MakeDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-permission-denied", unknown>>, unknown>;
declare class MakeDirectoryErrorPermissionDenied extends MakeDirectoryErrorPermissionDenied_base {
}
declare const MakeDirectoryErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-already-exists", unknown>>, unknown>;
declare class MakeDirectoryErrorAlreadyExists extends MakeDirectoryErrorAlreadyExists_base {
}
declare const MakeDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-not-directory", unknown>>, unknown>;
declare class MakeDirectoryErrorNotDirectory extends MakeDirectoryErrorNotDirectory_base {
}
declare const MakeDirectoryErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-no-space", unknown>>, unknown>;
declare class MakeDirectoryErrorNoSpace extends MakeDirectoryErrorNoSpace_base {
}
declare const MakeDirectoryErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-read-only", unknown>>, unknown>;
declare class MakeDirectoryErrorReadOnly extends MakeDirectoryErrorReadOnly_base {
}
declare const MakeDirectoryErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-invalid-argument", unknown>>, unknown>;
declare class MakeDirectoryErrorInvalidArgument extends MakeDirectoryErrorInvalidArgument_base {
}
declare const MakeDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-too-many-open-files", unknown>>, unknown>;
declare class MakeDirectoryErrorTooManyOpenFiles extends MakeDirectoryErrorTooManyOpenFiles_base {
}
declare const MakeDirectoryErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-busy", unknown>>, unknown>;
declare class MakeDirectoryErrorBusy extends MakeDirectoryErrorBusy_base {
}
declare const MakeDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-directory-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-directory-error", unknown>>, unknown>;
declare class MakeDirectoryError extends MakeDirectoryError_base {
}
export type MakeDirectoryErrors = (MakeDirectoryErrorNotFound | MakeDirectoryErrorPermissionDenied | MakeDirectoryErrorAlreadyExists | MakeDirectoryErrorNotDirectory | MakeDirectoryErrorNoSpace | MakeDirectoryErrorReadOnly | MakeDirectoryErrorInvalidArgument | MakeDirectoryErrorTooManyOpenFiles | MakeDirectoryErrorBusy | MakeDirectoryError);
export type MakeDirectoryResult = (DEither.Right<"file-system-make-directory", void> | DEither.Left<"file-system-make-directory-error", MakeDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        makeDirectory(path: string & DPath.Path, params?: MakeDirectoryParams): Promise<MakeDirectoryResult>;
    }
}
export declare const makeDirectory: (path: string & DPath.Path, params?: MakeDirectoryParams) => Promise<MakeDirectoryResult>;
export {};
