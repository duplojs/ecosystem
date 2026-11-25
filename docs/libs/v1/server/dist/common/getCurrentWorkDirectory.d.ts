import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        getCurrentWorkDirectory(): (DEither.Left<"get-current-work-directory-error", unknown> | DEither.Success<string & DPath.Absolute>);
    }
}
export declare const getCurrentWorkDirectory: () => (DEither.Left<"get-current-work-directory-error", unknown> | DEither.Success<string & DPath.Absolute>);
