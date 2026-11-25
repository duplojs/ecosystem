import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
export declare function createAbsolute(value: string): (DEither.Success<string & DPath.Absolute & DPath.Path> | DEither.Left<"create-absolute-path-error", string>);
