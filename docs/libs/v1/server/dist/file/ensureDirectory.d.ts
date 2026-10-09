import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type EnsureDirectoryResult = FileSystemEither<DEither.Right<"ensure-directory", void> | DEither.Left<"ensure-directory-permission-denied", unknown> | DEither.Left<"ensure-directory-not-directory", unknown> | DEither.Left<"ensure-directory-no-space", unknown> | DEither.Left<"ensure-directory-read-only", unknown> | DEither.Left<"ensure-directory-invalid-argument", unknown> | DEither.Left<"ensure-directory-too-many-open-files", unknown> | DEither.Left<"ensure-directory-busy", unknown> | DEither.Left<"ensure-directory-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        ensureDirectory(path: string & DPath.Path): Promise<EnsureDirectoryResult>;
    }
}
export declare const ensureDirectory: (path: string & DPath.Path) => Promise<EnsureDirectoryResult>;
