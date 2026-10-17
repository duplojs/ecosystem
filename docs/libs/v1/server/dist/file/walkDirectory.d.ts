import { FileInterface } from './fileInterface';
import { FolderInterface } from './folderInterface';
import { UnknownEntryInterface } from './unknownEntryInterface';
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
declare const WalkDirectoryErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-not-found", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-not-found", unknown>>, unknown>;
declare class WalkDirectoryErrorNotFound extends WalkDirectoryErrorNotFound_base {
}
declare const WalkDirectoryErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-permission-denied", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-permission-denied", unknown>>, unknown>;
declare class WalkDirectoryErrorPermissionDenied extends WalkDirectoryErrorPermissionDenied_base {
}
declare const WalkDirectoryErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-not-directory", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-not-directory", unknown>>, unknown>;
declare class WalkDirectoryErrorNotDirectory extends WalkDirectoryErrorNotDirectory_base {
}
declare const WalkDirectoryErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-too-many-open-files", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-too-many-open-files", unknown>>, unknown>;
declare class WalkDirectoryErrorTooManyOpenFiles extends WalkDirectoryErrorTooManyOpenFiles_base {
}
declare const WalkDirectoryErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-busy", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-busy", unknown>>, unknown>;
declare class WalkDirectoryErrorBusy extends WalkDirectoryErrorBusy_base {
}
declare const WalkDirectoryError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-walk-directory-error", Error> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-walk-directory-error", unknown>>, unknown>;
declare class WalkDirectoryError extends WalkDirectoryError_base {
}
export type WalkDirectoryErrors = (WalkDirectoryErrorNotFound | WalkDirectoryErrorPermissionDenied | WalkDirectoryErrorNotDirectory | WalkDirectoryErrorTooManyOpenFiles | WalkDirectoryErrorBusy | WalkDirectoryError);
export interface WalkDirectoryParams {
    recursive?: boolean;
    matcher?: DPath.PathMatcher;
}
export type WalkDirectoryResult = (DEither.Right<"file-system-walk-directory", Generator<FileInterface<string & DPath.Absolute> | FolderInterface<string & DPath.Absolute> | UnknownEntryInterface<string & DPath.Absolute>>> | DEither.Left<"file-system-walk-directory-error", WalkDirectoryErrors>);
declare module '../implementor' {
    interface ServerFunction {
        walkDirectory(path: string & DPath.Path, params?: WalkDirectoryParams): Promise<WalkDirectoryResult>;
    }
}
export declare const walkDirectory: (path: string & DPath.Path, params?: WalkDirectoryParams) => Promise<WalkDirectoryResult>;
export {};
