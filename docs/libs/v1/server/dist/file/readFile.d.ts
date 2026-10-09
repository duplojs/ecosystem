import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type ReadFileResult = FileSystemEither<DEither.Right<"read-file", Uint8Array> | DEither.Left<"read-file-not-found", unknown> | DEither.Left<"read-file-permission-denied", unknown> | DEither.Left<"read-file-is-directory", unknown> | DEither.Left<"read-file-not-directory", unknown> | DEither.Left<"read-file-too-many-open-files", unknown> | DEither.Left<"read-file-busy", unknown> | DEither.Left<"read-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        readFile(path: string & DPath.Path): Promise<ReadFileResult>;
    }
}
export declare const readFile: (path: string & DPath.Path) => Promise<ReadFileResult>;
