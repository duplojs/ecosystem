import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type CopyResult = FileSystemEither<DEither.Right<"copy", void> | DEither.Left<"copy-not-found", unknown> | DEither.Left<"copy-permission-denied", unknown> | DEither.Left<"copy-already-exists", unknown> | DEither.Left<"copy-not-directory", unknown> | DEither.Left<"copy-no-space", unknown> | DEither.Left<"copy-read-only", unknown> | DEither.Left<"copy-invalid-argument", unknown> | DEither.Left<"copy-too-many-open-files", unknown> | DEither.Left<"copy-busy", unknown> | DEither.Left<"copy-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        copy(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<CopyResult>;
    }
}
export declare function copy(toPath: string & DPath.Path): (fromPath: string & DPath.Path) => Promise<CopyResult>;
export declare function copy(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<CopyResult>;
