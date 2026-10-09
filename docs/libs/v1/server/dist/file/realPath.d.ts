import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type RealPathResult = FileSystemEither<DEither.Right<"real-path", string> | DEither.Left<"real-path-not-found", unknown> | DEither.Left<"real-path-permission-denied", unknown> | DEither.Left<"real-path-not-directory", unknown> | DEither.Left<"real-path-too-many-open-files", unknown> | DEither.Left<"real-path-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        realPath(path: string & DPath.Path): Promise<RealPathResult>;
    }
}
export declare const realPath: (path: string & DPath.Path) => Promise<RealPathResult>;
