import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type EnsureFileResult = FileSystemEither<DEither.Right<"ensure-file", void> | DEither.Left<"ensure-file-permission-denied", unknown> | DEither.Left<"ensure-file-is-directory", unknown> | DEither.Left<"ensure-file-not-directory", unknown> | DEither.Left<"ensure-file-no-space", unknown> | DEither.Left<"ensure-file-read-only", unknown> | DEither.Left<"ensure-file-invalid-argument", unknown> | DEither.Left<"ensure-file-too-many-open-files", unknown> | DEither.Left<"ensure-file-busy", unknown> | DEither.Left<"ensure-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        ensureFile(path: string & DPath.Path): Promise<EnsureFileResult>;
    }
}
export declare const ensureFile: (path: string & DPath.Path) => Promise<EnsureFileResult>;
