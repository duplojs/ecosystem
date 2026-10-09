import * as DEither from "@duplojs-v1/lang/either";
import * as DCommon from "@duplojs-v1/lang/common";
declare const MakeTemporaryDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-permission-denied", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorPermissionDenied extends MakeTemporaryDirectoryErrorPermissionDenied_base {
}
declare const MakeTemporaryDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-not-directory", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorNotDirectory extends MakeTemporaryDirectoryErrorNotDirectory_base {
}
declare const MakeTemporaryDirectoryErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-no-space", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorNoSpace extends MakeTemporaryDirectoryErrorNoSpace_base {
}
declare const MakeTemporaryDirectoryErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-read-only", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorReadOnly extends MakeTemporaryDirectoryErrorReadOnly_base {
}
declare const MakeTemporaryDirectoryErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-invalid-argument", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorInvalidArgument extends MakeTemporaryDirectoryErrorInvalidArgument_base {
}
declare const MakeTemporaryDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-too-many-open-files", unknown>>, unknown>;
declare class MakeTemporaryDirectoryErrorTooManyOpenFiles extends MakeTemporaryDirectoryErrorTooManyOpenFiles_base {
}
declare const MakeTemporaryDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-directory-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-directory-error", unknown>>, unknown>;
declare class MakeTemporaryDirectoryError extends MakeTemporaryDirectoryError_base {
}
export type MakeTemporaryDirectoryErrors = (MakeTemporaryDirectoryErrorPermissionDenied | MakeTemporaryDirectoryErrorNotDirectory | MakeTemporaryDirectoryErrorNoSpace | MakeTemporaryDirectoryErrorReadOnly | MakeTemporaryDirectoryErrorInvalidArgument | MakeTemporaryDirectoryErrorTooManyOpenFiles | MakeTemporaryDirectoryError);
export type MakeTemporaryDirectoryResult = (DEither.Right<"file-system-make-temporary-directory", string> | DEither.Left<"file-system-make-temporary-directory-error", MakeTemporaryDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        makeTemporaryDirectory(prefix: string): Promise<MakeTemporaryDirectoryResult>;
    }
}
export declare const makeTemporaryDirectory: (prefix: string) => Promise<MakeTemporaryDirectoryResult>;
export {};
