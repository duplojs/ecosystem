import * as DCommon from "@duplojs-v1/lang/common";
import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DChrono from "@duplojs-v1/lang/chrono";
export interface StatInfo {
    /** Type of entry */
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    /** Size in bytes */
    sizeBytes: number;
    /** Timestamps */
    modifiedAt: DChrono.TheDate | null;
    accessedAt: DChrono.TheDate | null;
    createdAt: DChrono.TheDate | null;
    changedAt: DChrono.TheDate | null;
    /** Unix/FS identifiers */
    deviceId: number;
    inode: number | null;
    permissionsMode: number | null;
    hardLinkCount: number | null;
    /** Ownership */
    ownerUserId: number | null;
    ownerGroupId: number | null;
    /** Special device id (if file is a device) */
    specialDeviceId: number | null;
    /** FS allocation */
    ioBlockSize: number | null;
    allocatedBlockCount: number | null;
    /** Special file kinds */
    isBlockDevice: boolean | null;
    isCharacterDevice: boolean | null;
    isFifo: boolean | null;
    isSocket: boolean | null;
}
declare const StatErrorNotFound_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-not-found", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-not-found", unknown>>, unknown>;
declare class StatErrorNotFound extends StatErrorNotFound_base {
}
declare const StatErrorPermissionDenied_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-permission-denied", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-permission-denied", unknown>>, unknown>;
declare class StatErrorPermissionDenied extends StatErrorPermissionDenied_base {
}
declare const StatErrorNotDirectory_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-not-directory", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-not-directory", unknown>>, unknown>;
declare class StatErrorNotDirectory extends StatErrorNotDirectory_base {
}
declare const StatErrorTooManyOpenFiles_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-too-many-open-files", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-too-many-open-files", unknown>>, unknown>;
declare class StatErrorTooManyOpenFiles extends StatErrorTooManyOpenFiles_base {
}
declare const StatErrorBusy_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-busy", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-busy", unknown>>, unknown>;
declare class StatErrorBusy extends StatErrorBusy_base {
}
declare const StatError_base: abstract new (error: Error) => DCommon.DuploJSError<"file-system-stat-error", Error> & import('@duplojs-v1/lang/kind').Kind<import('@duplojs-v1/lang/kind').Handler<import('@duplojs-v1/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-file-system-stat-error", unknown>>, unknown>;
declare class StatError extends StatError_base {
}
export type StatErrors = (StatErrorNotFound | StatErrorPermissionDenied | StatErrorNotDirectory | StatErrorTooManyOpenFiles | StatErrorBusy | StatError);
export type StatResult = (DEither.Right<"file-system-stat", StatInfo> | DEither.Left<"file-system-stat-error", StatErrors>);
declare module '../implementor' {
    interface ServerFunction {
        stat(path: string & DPath.Path): Promise<StatResult>;
    }
}
export declare const stat: (path: string & DPath.Path) => Promise<StatResult>;
export {};
