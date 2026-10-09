import { FileInterface } from './fileInterface';
import { FolderInterface } from './folderInterface';
import { UnknownEntryInterface } from './unknownEntryInterface';
import { FileSystemEither } from './types';
import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export interface WalkDirectoryParams {
    recursive?: boolean;
}
export type WalkDirectoryResult = FileSystemEither<DEither.Right<"walk-directory", Generator<FileInterface | FolderInterface | UnknownEntryInterface>> | DEither.Left<"walk-directory-not-found", unknown> | DEither.Left<"walk-directory-permission-denied", unknown> | DEither.Left<"walk-directory-not-directory", unknown> | DEither.Left<"walk-directory-too-many-open-files", unknown> | DEither.Left<"walk-directory-busy", unknown> | DEither.Left<"walk-directory-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        walkDirectory(path: string & DPath.Path, params?: WalkDirectoryParams): Promise<WalkDirectoryResult>;
    }
}
export declare const walkDirectory: (path: string & DPath.Path, params?: WalkDirectoryParams) => Promise<WalkDirectoryResult>;
