import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type WriteFileResult = FileSystemEither<DEither.Right<"write-file", void> | DEither.Left<"write-file-not-found", unknown> | DEither.Left<"write-file-permission-denied", unknown> | DEither.Left<"write-file-is-directory", unknown> | DEither.Left<"write-file-not-directory", unknown> | DEither.Left<"write-file-no-space", unknown> | DEither.Left<"write-file-read-only", unknown> | DEither.Left<"write-file-invalid-argument", unknown> | DEither.Left<"write-file-too-many-open-files", unknown> | DEither.Left<"write-file-busy", unknown> | DEither.Left<"write-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        writeFile(path: string & DPath.Path, data: Uint8Array): Promise<WriteFileResult>;
    }
}
export declare function writeFile(data: Uint8Array): (path: string & DPath.Path) => Promise<WriteFileResult>;
export declare function writeFile(path: string & DPath.Path, data: Uint8Array): Promise<WriteFileResult>;
