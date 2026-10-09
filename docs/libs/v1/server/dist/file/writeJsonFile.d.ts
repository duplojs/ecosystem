import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface WriteJsonFile {
    space?: number;
}
export type WriteJsonFileResult = FileSystemEither<DEither.Right<"write-json-file", void> | DEither.Left<"write-json-file-not-found", unknown> | DEither.Left<"write-json-file-permission-denied", unknown> | DEither.Left<"write-json-file-is-directory", unknown> | DEither.Left<"write-json-file-not-directory", unknown> | DEither.Left<"write-json-file-no-space", unknown> | DEither.Left<"write-json-file-read-only", unknown> | DEither.Left<"write-json-file-invalid-argument", unknown> | DEither.Left<"write-json-file-too-many-open-files", unknown> | DEither.Left<"write-json-file-busy", unknown> | DEither.Left<"write-json-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        writeJsonFile(path: string & DPath.Path, data: unknown, params?: WriteJsonFile): Promise<WriteJsonFileResult>;
    }
}
export declare function writeJsonFile(data: unknown): (path: string & DPath.Path) => Promise<WriteJsonFileResult>;
export declare function writeJsonFile(path: string & DPath.Path, data: unknown, params?: WriteJsonFile): Promise<WriteJsonFileResult>;
export {};
