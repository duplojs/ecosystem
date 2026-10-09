import { StatInfo } from './stat';
import { FileSystemEither } from './types';
import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export type LinkStatResult = FileSystemEither<DEither.Right<"link-stat", StatInfo> | DEither.Left<"link-stat-not-found", unknown> | DEither.Left<"link-stat-permission-denied", unknown> | DEither.Left<"link-stat-not-directory", unknown> | DEither.Left<"link-stat-too-many-open-files", unknown> | DEither.Left<"link-stat-busy", unknown> | DEither.Left<"link-stat-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        linkStat(path: string & DPath.Path): Promise<LinkStatResult>;
    }
}
export declare const linkStat: (path: string & DPath.Path) => Promise<LinkStatResult>;
