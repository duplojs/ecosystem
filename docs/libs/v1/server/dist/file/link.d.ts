import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type LinkResult = FileSystemEither<DEither.Right<"link", void> | DEither.Left<"link-not-found", unknown> | DEither.Left<"link-permission-denied", unknown> | DEither.Left<"link-already-exists", unknown> | DEither.Left<"link-not-directory", unknown> | DEither.Left<"link-no-space", unknown> | DEither.Left<"link-read-only", unknown> | DEither.Left<"link-invalid-argument", unknown> | DEither.Left<"link-too-many-open-files", unknown> | DEither.Left<"link-busy", unknown> | DEither.Left<"link-cross-device", unknown> | DEither.Left<"link-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        link(existingPath: string & DPath.Path, newPath: string & DPath.Path): Promise<LinkResult>;
    }
}
export declare function link(newPath: string & DPath.Path): (existingPath: string & DPath.Path) => Promise<LinkResult>;
export declare function link(existingPath: string & DPath.Path, newPath: string & DPath.Path): Promise<LinkResult>;
