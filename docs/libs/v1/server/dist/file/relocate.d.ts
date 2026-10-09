import { FileSystemEither } from './types';
import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export type RelocateResult = FileSystemEither<DEither.Right<"relocate", string & DPath.Path> | DEither.Left<"relocate-not-found", unknown> | DEither.Left<"relocate-permission-denied", unknown> | DEither.Left<"relocate-already-exists", unknown> | DEither.Left<"relocate-is-directory", unknown> | DEither.Left<"relocate-not-directory", unknown> | DEither.Left<"relocate-directory-not-empty", unknown> | DEither.Left<"relocate-read-only", unknown> | DEither.Left<"relocate-invalid-argument", unknown> | DEither.Left<"relocate-busy", unknown> | DEither.Left<"relocate-cross-device", unknown> | DEither.Left<"relocate-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        relocate(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<RelocateResult>;
    }
}
export declare function relocate(toPath: string & DPath.Path): (fromPath: string & DPath.Path) => Promise<RelocateResult>;
export declare function relocate(fromPath: string & DPath.Path, toPath: string & DPath.Path): Promise<RelocateResult>;
