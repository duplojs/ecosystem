import { StatInfo } from './stat';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
declare const LinkStatErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-not-found", unknown>>, unknown>;
declare class LinkStatErrorNotFound extends LinkStatErrorNotFound_base {
}
declare const LinkStatErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-permission-denied", unknown>>, unknown>;
declare class LinkStatErrorPermissionDenied extends LinkStatErrorPermissionDenied_base {
}
declare const LinkStatErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-not-directory", unknown>>, unknown>;
declare class LinkStatErrorNotDirectory extends LinkStatErrorNotDirectory_base {
}
declare const LinkStatErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-too-many-open-files", unknown>>, unknown>;
declare class LinkStatErrorTooManyOpenFiles extends LinkStatErrorTooManyOpenFiles_base {
}
declare const LinkStatErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-busy", unknown>>, unknown>;
declare class LinkStatErrorBusy extends LinkStatErrorBusy_base {
}
declare const LinkStatError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-link-stat-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-link-stat-error", unknown>>, unknown>;
declare class LinkStatError extends LinkStatError_base {
}
export type LinkStatErrors = (LinkStatErrorNotFound | LinkStatErrorPermissionDenied | LinkStatErrorNotDirectory | LinkStatErrorTooManyOpenFiles | LinkStatErrorBusy | LinkStatError);
export type LinkStatResult = (DEither.Right<"file-system-link-stat", StatInfo> | DEither.Left<"file-system-link-stat-error", LinkStatErrors>);
declare module '../implementor' {
    interface ServerFunction {
        linkStat(path: string & DPath.Path): Promise<LinkStatResult>;
    }
}
export declare const linkStat: (path: string & DPath.Path) => Promise<LinkStatResult>;
export {};
