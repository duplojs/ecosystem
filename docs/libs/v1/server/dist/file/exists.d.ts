import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type ExistsResult = FileSystemEither<DEither.Right<"exists", void> | DEither.Left<"exists-not-found", unknown> | DEither.Left<"exists-permission-denied", unknown> | DEither.Left<"exists-not-directory", unknown> | DEither.Left<"exists-too-many-open-files", unknown> | DEither.Left<"exists-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        exists(path: string & DPath.Path): Promise<ExistsResult>;
    }
}
export declare const exists: (path: string & DPath.Path) => Promise<ExistsResult>;
