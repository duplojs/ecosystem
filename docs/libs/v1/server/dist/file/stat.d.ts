import { FileSystemEither } from './types';
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
export type StatResult = FileSystemEither<DEither.Right<"stat", StatInfo> | DEither.Left<"stat-not-found", unknown> | DEither.Left<"stat-permission-denied", unknown> | DEither.Left<"stat-not-directory", unknown> | DEither.Left<"stat-too-many-open-files", unknown> | DEither.Left<"stat-busy", unknown> | DEither.Left<"stat-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        stat(path: string & DPath.Path): Promise<StatResult>;
    }
}
export declare const stat: (path: string & DPath.Path) => Promise<StatResult>;
