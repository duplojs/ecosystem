import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export interface SymlinkParams {
    /**
     * @remarks
     * Specify the symbolic link type as file, directory or NTFS junction.
     * This option only applies to Windows and is ignored on other operating systems.
     */
    type: "file" | "dir" | "junction";
}
export type SymlinkResult = FileSystemEither<DEither.Right<"symlink", void> | DEither.Left<"symlink-not-found", unknown> | DEither.Left<"symlink-permission-denied", unknown> | DEither.Left<"symlink-already-exists", unknown> | DEither.Left<"symlink-not-directory", unknown> | DEither.Left<"symlink-read-only", unknown> | DEither.Left<"symlink-invalid-argument", unknown> | DEither.Left<"symlink-too-many-open-files", unknown> | DEither.Left<"symlink-busy", unknown> | DEither.Left<"symlink-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        symlink(oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams): Promise<SymlinkResult>;
    }
}
export declare function symlink(newPath: string & DPath.Path): (oldPath: string & DPath.Path) => Promise<SymlinkResult>;
export declare function symlink(oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams): Promise<SymlinkResult>;
