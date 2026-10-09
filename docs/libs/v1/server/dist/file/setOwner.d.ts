import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export interface SetOwnerParams {
    userId: number;
    groupId: number;
}
export type SetOwnerResult = FileSystemEither<DEither.Right<"set-owner", void> | DEither.Left<"set-owner-not-found", unknown> | DEither.Left<"set-owner-permission-denied", unknown> | DEither.Left<"set-owner-not-directory", unknown> | DEither.Left<"set-owner-read-only", unknown> | DEither.Left<"set-owner-invalid-argument", unknown> | DEither.Left<"set-owner-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        setOwner(path: string & DPath.Path, params: SetOwnerParams): Promise<SetOwnerResult>;
    }
}
export declare function setOwner(params: SetOwnerParams): (path: string & DPath.Path) => Promise<SetOwnerResult>;
export declare function setOwner(path: string & DPath.Path, params: SetOwnerParams): Promise<SetOwnerResult>;
