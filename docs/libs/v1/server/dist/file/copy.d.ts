import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
declare const CopyErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-not-found", unknown>>, unknown>;
export declare class CopyErrorNotFound extends CopyErrorNotFound_base {
}
declare const CopyErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-permission-denied", unknown>>, unknown>;
export declare class CopyErrorPermissionDenied extends CopyErrorPermissionDenied_base {
}
declare const CopyErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-already-exists", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-already-exists", unknown>>, unknown>;
export declare class CopyErrorAlreadyExists extends CopyErrorAlreadyExists_base {
}
declare const CopyErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-not-directory", unknown>>, unknown>;
export declare class CopyErrorNotDirectory extends CopyErrorNotDirectory_base {
}
declare const CopyErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-no-space", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-no-space", unknown>>, unknown>;
export declare class CopyErrorNoSpace extends CopyErrorNoSpace_base {
}
declare const CopyErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-read-only", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-read-only", unknown>>, unknown>;
export declare class CopyErrorReadOnly extends CopyErrorReadOnly_base {
}
declare const CopyErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-invalid-argument", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-invalid-argument", unknown>>, unknown>;
export declare class CopyErrorInvalidArgument extends CopyErrorInvalidArgument_base {
}
declare const CopyErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-too-many-open-files", unknown>>, unknown>;
export declare class CopyErrorTooManyOpenFiles extends CopyErrorTooManyOpenFiles_base {
}
declare const CopyErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-busy", unknown>>, unknown>;
export declare class CopyErrorBusy extends CopyErrorBusy_base {
}
declare const CopyError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-copy-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-copy-error", unknown>>, unknown>;
export declare class CopyError extends CopyError_base {
}
export type CopyErrors = (CopyErrorNotFound | CopyErrorPermissionDenied | CopyErrorAlreadyExists | CopyErrorNotDirectory | CopyErrorNoSpace | CopyErrorReadOnly | CopyErrorInvalidArgument | CopyErrorTooManyOpenFiles | CopyErrorBusy | CopyError);
export type CopyResult = (DEither.Right<"file-system-copy", void> | DEither.Left<"file-system-copy-error", CopyErrors>);
declare module '../implementor' {
    interface ServerFunction {
        copy(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<CopyResult>;
    }
}
export declare function copy(toPath: DPath.AnyPath): (fromPath: DPath.AnyPath) => Promise<CopyResult>;
export declare function copy(fromPath: DPath.AnyPath, toPath: DPath.AnyPath): Promise<CopyResult>;
export {};
