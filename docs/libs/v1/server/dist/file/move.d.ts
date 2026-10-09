import { FileSystemEither } from './types';
import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export type MoveResult = FileSystemEither<DEither.Right<"move", void> | DEither.Left<"move-not-found", unknown> | DEither.Left<"move-permission-denied", unknown> | DEither.Left<"move-already-exists", unknown> | DEither.Left<"move-is-directory", unknown> | DEither.Left<"move-not-directory", unknown> | DEither.Left<"move-directory-not-empty", unknown> | DEither.Left<"move-read-only", unknown> | DEither.Left<"move-invalid-argument", unknown> | DEither.Left<"move-busy", unknown> | DEither.Left<"move-cross-device", unknown> | DEither.Left<"move-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        move(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<MoveResult>;
    }
}
export declare function move(toPath: string & DPath.Path): (fromPath: string & DPath.Path) => Promise<MoveResult>;
export declare function move(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<MoveResult>;
