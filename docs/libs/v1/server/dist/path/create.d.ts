import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
export declare function create(value: string): (DEither.Success<string & DPath.Path> | DEither.Left<"create-path-error", string>);
