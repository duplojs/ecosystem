import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        setCurrentWorkingDirectory(path: string & DPath.Absolute): DEither.Left<"set-current-working-directory-error", unknown> | DEither.Ok;
    }
}
export declare const setCurrentWorkingDirectory: (path: string & DPath.Absolute) => DEither.Left<"set-current-working-directory-error", unknown> | DEither.Ok;
