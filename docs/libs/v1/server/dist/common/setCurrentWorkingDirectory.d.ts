import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        setCurrentWorkingDirectory(path: string & DPath.Absolute): DEither.Fail | DEither.Ok;
    }
}
export declare const setCurrentWorkingDirectory: (path: string & DPath.Absolute) => DEither.Fail | DEither.Ok;
