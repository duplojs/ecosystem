import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type ReadTextFileResult = FileSystemEither<DEither.Right<"read-text-file", string> | DEither.Left<"read-text-file-not-found", unknown> | DEither.Left<"read-text-file-permission-denied", unknown> | DEither.Left<"read-text-file-is-directory", unknown> | DEither.Left<"read-text-file-not-directory", unknown> | DEither.Left<"read-text-file-too-many-open-files", unknown> | DEither.Left<"read-text-file-busy", unknown> | DEither.Left<"read-text-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        readTextFile(path: string & DPath.Path): Promise<ReadTextFileResult>;
    }
}
export declare const readTextFile: (path: string & DPath.Path) => Promise<ReadTextFileResult>;
