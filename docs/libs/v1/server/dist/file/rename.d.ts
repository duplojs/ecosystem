import { FileSystemEither } from './types';
import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export type RenameResult = FileSystemEither<DEither.Right<"rename", string & DPath.Path> | DEither.Left<"rename-not-found", unknown> | DEither.Left<"rename-permission-denied", unknown> | DEither.Left<"rename-already-exists", unknown> | DEither.Left<"rename-is-directory", unknown> | DEither.Left<"rename-not-directory", unknown> | DEither.Left<"rename-directory-not-empty", unknown> | DEither.Left<"rename-read-only", unknown> | DEither.Left<"rename-invalid-argument", unknown> | DEither.Left<"rename-busy", unknown> | DEither.Left<"rename-cross-device", unknown> | DEither.Left<"rename-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        rename(path: string & DPath.Path, newName: string & DPath.Segment): Promise<RenameResult>;
    }
}
export declare function rename(newName: string & DPath.Segment): (path: string & DPath.Path) => Promise<RenameResult>;
export declare function rename(path: string & DPath.Path, newName: string & DPath.Segment): Promise<RenameResult>;
