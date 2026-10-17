import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        setCurrentWorkingDirectory(path: string & DPath.Absolute): DEither.Fail | DEither.Ok;
    }
}
export declare const setCurrentWorkingDirectory: (path: string & DPath.Absolute) => DEither.Fail | DEither.Ok;
