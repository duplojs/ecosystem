import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
export declare function toPlatformPath(path: DPath.AnyPath): (DEither.Success<string> | DEither.Left<"to-platform-path-error", DPath.AnyPath>);
