import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        getCurrentWorkDirectory(): (DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>);
    }
}
export declare const getCurrentWorkDirectory: () => (DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>);
