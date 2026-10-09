import { FileSystemEither } from './types';
import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
interface ReadDirectoryParams {
    recursive?: boolean;
}
export type ReadDirectoryResult = FileSystemEither<DEither.Right<"read-directory", (string & DPath.Path)[]> | DEither.Left<"read-directory-not-found", unknown> | DEither.Left<"read-directory-permission-denied", unknown> | DEither.Left<"read-directory-not-directory", unknown> | DEither.Left<"read-directory-too-many-open-files", unknown> | DEither.Left<"read-directory-busy", unknown> | DEither.Left<"read-directory-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        readDirectory(path: string & DPath.Path, params?: ReadDirectoryParams): Promise<ReadDirectoryResult>;
    }
}
export declare const readDirectory: (path: string & DPath.Path, params?: ReadDirectoryParams) => Promise<ReadDirectoryResult>;
export {};
