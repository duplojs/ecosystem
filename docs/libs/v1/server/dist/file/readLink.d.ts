import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const ReadLinkErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-not-found", unknown>>, unknown>;
declare class ReadLinkErrorNotFound extends ReadLinkErrorNotFound_base {
}
declare const ReadLinkErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-permission-denied", unknown>>, unknown>;
declare class ReadLinkErrorPermissionDenied extends ReadLinkErrorPermissionDenied_base {
}
declare const ReadLinkErrorInvalidArgument_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-invalid-argument", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-invalid-argument", unknown>>, unknown>;
declare class ReadLinkErrorInvalidArgument extends ReadLinkErrorInvalidArgument_base {
}
declare const ReadLinkErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-not-directory", unknown>>, unknown>;
declare class ReadLinkErrorNotDirectory extends ReadLinkErrorNotDirectory_base {
}
declare const ReadLinkErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-too-many-open-files", unknown>>, unknown>;
declare class ReadLinkErrorTooManyOpenFiles extends ReadLinkErrorTooManyOpenFiles_base {
}
declare const ReadLinkError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-read-link-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-read-link-error", unknown>>, unknown>;
declare class ReadLinkError extends ReadLinkError_base {
}
export type ReadLinkErrors = (ReadLinkErrorNotFound | ReadLinkErrorPermissionDenied | ReadLinkErrorInvalidArgument | ReadLinkErrorNotDirectory | ReadLinkErrorTooManyOpenFiles | ReadLinkError);
export type ReadLinkResult = (DEither.Right<"file-system-read-link", string> | DEither.Left<"file-system-read-link-error", ReadLinkErrors>);
declare module '../implementor' {
    interface ServerFunction {
        readLink(path: string & DPath.Path): Promise<ReadLinkResult>;
    }
}
export declare const readLink: (path: string & DPath.Path) => Promise<ReadLinkResult>;
export {};
