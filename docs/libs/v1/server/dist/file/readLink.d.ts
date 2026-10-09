import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
export type ReadLinkResult = FileSystemEither<DEither.Right<"read-link", string> | DEither.Left<"read-link-not-found", unknown> | DEither.Left<"read-link-permission-denied", unknown> | DEither.Left<"read-link-invalid-argument", unknown> | DEither.Left<"read-link-not-directory", unknown> | DEither.Left<"read-link-too-many-open-files", unknown> | DEither.Left<"read-link-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        readLink(path: string & DPath.Path): Promise<ReadLinkResult>;
    }
}
export declare const readLink: (path: string & DPath.Path) => Promise<ReadLinkResult>;
