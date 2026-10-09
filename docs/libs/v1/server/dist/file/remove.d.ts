import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface RemoveDirectoryParams {
    recursive?: boolean;
}
export type RemoveResult = FileSystemEither<DEither.Right<"remove", void> | DEither.Left<"remove-not-found", unknown> | DEither.Left<"remove-permission-denied", unknown> | DEither.Left<"remove-is-directory", unknown> | DEither.Left<"remove-not-directory", unknown> | DEither.Left<"remove-directory-not-empty", unknown> | DEither.Left<"remove-read-only", unknown> | DEither.Left<"remove-invalid-argument", unknown> | DEither.Left<"remove-busy", unknown> | DEither.Left<"remove-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        remove(path: string & DPath.Path, params?: RemoveDirectoryParams): Promise<RemoveResult>;
    }
}
export declare const remove: (path: string & DPath.Path, params?: RemoveDirectoryParams) => Promise<RemoveResult>;
export {};
