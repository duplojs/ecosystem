import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import * as DChrono from "@duplojs-v1/lang/chrono";
import type * as DPath from "@duplojs-v1/lang/path";
interface SetTimeParams {
    accessTime: DChrono.TheDate;
    modifiedTime: DChrono.TheDate;
}
export type SetTimeResult = FileSystemEither<DEither.Right<"set-time", void> | DEither.Left<"set-time-not-found", unknown> | DEither.Left<"set-time-permission-denied", unknown> | DEither.Left<"set-time-not-directory", unknown> | DEither.Left<"set-time-read-only", unknown> | DEither.Left<"set-time-invalid-argument", unknown> | DEither.Left<"set-time-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        setTime(path: string & DPath.Path, params: SetTimeParams): Promise<SetTimeResult>;
    }
}
export declare function setTime(params: SetTimeParams): (path: string & DPath.Path) => Promise<SetTimeResult>;
export declare function setTime(path: string & DPath.Path, params: SetTimeParams): Promise<SetTimeResult>;
export {};
