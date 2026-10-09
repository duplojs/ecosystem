import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DCommon from "@duplojs-v1/lang/common";
declare const ExistsErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-exists-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-exists-not-found", unknown>>, unknown>;
declare class ExistsErrorNotFound extends ExistsErrorNotFound_base {
}
declare const ExistsErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-exists-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-exists-permission-denied", unknown>>, unknown>;
declare class ExistsErrorPermissionDenied extends ExistsErrorPermissionDenied_base {
}
declare const ExistsErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-exists-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-exists-not-directory", unknown>>, unknown>;
declare class ExistsErrorNotDirectory extends ExistsErrorNotDirectory_base {
}
declare const ExistsErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-exists-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-exists-too-many-open-files", unknown>>, unknown>;
declare class ExistsErrorTooManyOpenFiles extends ExistsErrorTooManyOpenFiles_base {
}
declare const ExistsError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-exists-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-exists-error", unknown>>, unknown>;
declare class ExistsError extends ExistsError_base {
}
export type ExistsErrors = (ExistsErrorNotFound | ExistsErrorPermissionDenied | ExistsErrorNotDirectory | ExistsErrorTooManyOpenFiles | ExistsError);
export type ExistsResult = (DEither.Right<"file-system-exists", void> | DEither.Left<"file-system-exists-error", ExistsErrors>);
declare module '../implementor' {
    interface ServerFunction {
        exists(path: string & DPath.Path): Promise<ExistsResult>;
    }
}
export declare const exists: (path: string & DPath.Path) => Promise<ExistsResult>;
export {};
