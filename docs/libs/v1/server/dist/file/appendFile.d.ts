import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type AppendFileResult = FileSystemEither<DEither.Right<"append-file", void> | DEither.Left<"append-file-not-found", unknown> | DEither.Left<"append-file-permission-denied", unknown> | DEither.Left<"append-file-is-directory", unknown> | DEither.Left<"append-file-not-directory", unknown> | DEither.Left<"append-file-no-space", unknown> | DEither.Left<"append-file-read-only", unknown> | DEither.Left<"append-file-invalid-argument", unknown> | DEither.Left<"append-file-too-many-open-files", unknown> | DEither.Left<"append-file-busy", unknown> | DEither.Left<"append-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        appendFile(path: string & DPath.Path, data: Uint8Array): Promise<AppendFileResult>;
    }
}
export declare function appendFile(data: Uint8Array): (path: string & DPath.Path) => Promise<AppendFileResult>;
export declare function appendFile(path: string & DPath.Path, data: Uint8Array): Promise<AppendFileResult>;
