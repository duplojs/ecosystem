import * as DCommon from "@duplojs-v1/lang/common";
import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
declare const MakeTemporaryFileErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-permission-denied", unknown>>, unknown>;
declare class MakeTemporaryFileErrorPermissionDenied extends MakeTemporaryFileErrorPermissionDenied_base {
}
declare const MakeTemporaryFileErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-already-exists", unknown>>, unknown>;
declare class MakeTemporaryFileErrorAlreadyExists extends MakeTemporaryFileErrorAlreadyExists_base {
}
declare const MakeTemporaryFileErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-not-directory", unknown>>, unknown>;
declare class MakeTemporaryFileErrorNotDirectory extends MakeTemporaryFileErrorNotDirectory_base {
}
declare const MakeTemporaryFileErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-no-space", unknown>>, unknown>;
declare class MakeTemporaryFileErrorNoSpace extends MakeTemporaryFileErrorNoSpace_base {
}
declare const MakeTemporaryFileErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-read-only", unknown>>, unknown>;
declare class MakeTemporaryFileErrorReadOnly extends MakeTemporaryFileErrorReadOnly_base {
}
declare const MakeTemporaryFileErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-invalid-argument", unknown>>, unknown>;
declare class MakeTemporaryFileErrorInvalidArgument extends MakeTemporaryFileErrorInvalidArgument_base {
}
declare const MakeTemporaryFileErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-too-many-open-files", unknown>>, unknown>;
declare class MakeTemporaryFileErrorTooManyOpenFiles extends MakeTemporaryFileErrorTooManyOpenFiles_base {
}
declare const MakeTemporaryFileError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-make-temporary-file-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-make-temporary-file-error", unknown>>, unknown>;
declare class MakeTemporaryFileError extends MakeTemporaryFileError_base {
}
export type MakeTemporaryFileErrors = (MakeTemporaryFileErrorPermissionDenied | MakeTemporaryFileErrorAlreadyExists | MakeTemporaryFileErrorNotDirectory | MakeTemporaryFileErrorNoSpace | MakeTemporaryFileErrorReadOnly | MakeTemporaryFileErrorInvalidArgument | MakeTemporaryFileErrorTooManyOpenFiles | MakeTemporaryFileError);
export type MakeTemporaryFileResult = (DEither.Right<"file-system-make-temporary-file", string> | DEither.Left<"file-system-make-temporary-file-error", MakeTemporaryFileErrors>);
declare module '../implementor' {
    interface ServerFunction {
        makeTemporaryFile(prefix: string & DPath.Segment, suffix?: string & DPath.Segment): Promise<MakeTemporaryFileResult>;
    }
}
export declare const makeTemporaryFile: (prefix: string & DPath.Segment, suffix?: string & DPath.Segment) => Promise<MakeTemporaryFileResult>;
export {};
