import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type WriteTextFileResult = FileSystemEither<DEither.Right<"write-text-file", void> | DEither.Left<"write-text-file-not-found", unknown> | DEither.Left<"write-text-file-permission-denied", unknown> | DEither.Left<"write-text-file-is-directory", unknown> | DEither.Left<"write-text-file-not-directory", unknown> | DEither.Left<"write-text-file-no-space", unknown> | DEither.Left<"write-text-file-read-only", unknown> | DEither.Left<"write-text-file-invalid-argument", unknown> | DEither.Left<"write-text-file-too-many-open-files", unknown> | DEither.Left<"write-text-file-busy", unknown> | DEither.Left<"write-text-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        writeTextFile(path: string & DPath.Path, data: string): Promise<WriteTextFileResult>;
    }
}
export declare function writeTextFile(data: string): (path: string & DPath.Path) => Promise<WriteTextFileResult>;
export declare function writeTextFile(path: string & DPath.Path, data: string): Promise<WriteTextFileResult>;
