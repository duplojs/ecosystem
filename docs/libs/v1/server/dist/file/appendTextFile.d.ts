import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type AppendTextFileResult = FileSystemEither<DEither.Right<"append-text-file", void> | DEither.Left<"append-text-file-not-found", unknown> | DEither.Left<"append-text-file-permission-denied", unknown> | DEither.Left<"append-text-file-is-directory", unknown> | DEither.Left<"append-text-file-not-directory", unknown> | DEither.Left<"append-text-file-no-space", unknown> | DEither.Left<"append-text-file-read-only", unknown> | DEither.Left<"append-text-file-invalid-argument", unknown> | DEither.Left<"append-text-file-too-many-open-files", unknown> | DEither.Left<"append-text-file-busy", unknown> | DEither.Left<"append-text-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        appendTextFile(path: string & DPath.Path, data: string): Promise<AppendTextFileResult>;
    }
}
export declare function appendTextFile(data: string): (path: string & DPath.Path) => Promise<AppendTextFileResult>;
export declare function appendTextFile(path: string & DPath.Path, data: string): Promise<AppendTextFileResult>;
