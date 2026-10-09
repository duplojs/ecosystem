import { FileSystemEither } from './types';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type ReadJsonFileResult = FileSystemEither<DEither.Right<"read-json-file", DCommon.Json> | DEither.Left<"read-json-file-not-found", unknown> | DEither.Left<"read-json-file-permission-denied", unknown> | DEither.Left<"read-json-file-is-directory", unknown> | DEither.Left<"read-json-file-not-directory", unknown> | DEither.Left<"read-json-file-too-many-open-files", unknown> | DEither.Left<"read-json-file-busy", unknown> | DEither.Left<"read-json-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        readJsonFile(path: string & DPath.Path): Promise<ReadJsonFileResult>;
    }
}
export declare const readJsonFile: (path: string & DPath.Path) => Promise<ReadJsonFileResult>;
