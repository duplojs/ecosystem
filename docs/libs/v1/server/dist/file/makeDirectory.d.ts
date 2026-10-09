import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface MakeDirectoryParams {
    recursive?: boolean;
}
export type MakeDirectoryResult = FileSystemEither<DEither.Right<"make-directory", void> | DEither.Left<"make-directory-not-found", unknown> | DEither.Left<"make-directory-permission-denied", unknown> | DEither.Left<"make-directory-already-exists", unknown> | DEither.Left<"make-directory-not-directory", unknown> | DEither.Left<"make-directory-no-space", unknown> | DEither.Left<"make-directory-read-only", unknown> | DEither.Left<"make-directory-invalid-argument", unknown> | DEither.Left<"make-directory-too-many-open-files", unknown> | DEither.Left<"make-directory-busy", unknown> | DEither.Left<"make-directory-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        makeDirectory(path: string & DPath.Path, params?: MakeDirectoryParams): Promise<MakeDirectoryResult>;
    }
}
export declare const makeDirectory: (path: string & DPath.Path, params?: MakeDirectoryParams) => Promise<MakeDirectoryResult>;
export {};
