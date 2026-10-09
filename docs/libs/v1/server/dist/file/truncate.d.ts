import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type TruncateResult = FileSystemEither<DEither.Right<"truncate", void> | DEither.Left<"truncate-not-found", unknown> | DEither.Left<"truncate-permission-denied", unknown> | DEither.Left<"truncate-is-directory", unknown> | DEither.Left<"truncate-not-directory", unknown> | DEither.Left<"truncate-no-space", unknown> | DEither.Left<"truncate-read-only", unknown> | DEither.Left<"truncate-invalid-argument", unknown> | DEither.Left<"truncate-too-many-open-files", unknown> | DEither.Left<"truncate-busy", unknown> | DEither.Left<"truncate-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        truncate(path: string & DPath.Path, size?: number): Promise<TruncateResult>;
    }
}
export declare const truncate: (path: string & DPath.Path, size?: number) => Promise<TruncateResult>;
