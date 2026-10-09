import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const LinkErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-not-found", unknown>>, unknown>;
declare class LinkErrorNotFound extends LinkErrorNotFound_base {
}
declare const LinkErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-permission-denied", unknown>>, unknown>;
declare class LinkErrorPermissionDenied extends LinkErrorPermissionDenied_base {
}
declare const LinkErrorAlreadyExists_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-already-exists", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-already-exists", unknown>>, unknown>;
declare class LinkErrorAlreadyExists extends LinkErrorAlreadyExists_base {
}
declare const LinkErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-not-directory", unknown>>, unknown>;
declare class LinkErrorNotDirectory extends LinkErrorNotDirectory_base {
}
declare const LinkErrorNoSpace_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-no-space", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-no-space", unknown>>, unknown>;
declare class LinkErrorNoSpace extends LinkErrorNoSpace_base {
}
declare const LinkErrorReadOnly_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-read-only", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-read-only", unknown>>, unknown>;
declare class LinkErrorReadOnly extends LinkErrorReadOnly_base {
}
declare const LinkErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-invalid-argument", unknown>>, unknown>;
declare class LinkErrorInvalidArgument extends LinkErrorInvalidArgument_base {
}
declare const LinkErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-too-many-open-files", unknown>>, unknown>;
declare class LinkErrorTooManyOpenFiles extends LinkErrorTooManyOpenFiles_base {
}
declare const LinkErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-busy", unknown>>, unknown>;
declare class LinkErrorBusy extends LinkErrorBusy_base {
}
declare const LinkErrorCrossDevice_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-cross-device", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-cross-device", unknown>>, unknown>;
declare class LinkErrorCrossDevice extends LinkErrorCrossDevice_base {
}
declare const LinkError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-error", unknown>>, unknown>;
declare class LinkError extends LinkError_base {
}
export type LinkErrors = (LinkErrorNotFound | LinkErrorPermissionDenied | LinkErrorAlreadyExists | LinkErrorNotDirectory | LinkErrorNoSpace | LinkErrorReadOnly | LinkErrorInvalidArgument | LinkErrorTooManyOpenFiles | LinkErrorBusy | LinkErrorCrossDevice | LinkError);
export type LinkResult = (DEither.Right<"file-system-link", void> | DEither.Left<"file-system-link-error", LinkErrors>);
declare module '../implementor' {
    interface ServerFunction {
        link(existingPath: string & DPath.Path, newPath: string & DPath.Path): Promise<LinkResult>;
    }
}
export declare function link(newPath: string & DPath.Path): (existingPath: string & DPath.Path) => Promise<LinkResult>;
export declare function link(existingPath: string & DPath.Path, newPath: string & DPath.Path): Promise<LinkResult>;
export {};
