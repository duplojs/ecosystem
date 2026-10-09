import * as DEither from "@duplojs-v1/lang/either";
import * as DPath from "@duplojs-v1/lang/path";
declare module '../implementor' {
    interface ServerFunction {
        getCurrentWorkDirectory(): (DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>);
    }
}
export declare const getCurrentWorkDirectory: () => (DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>);
