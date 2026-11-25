import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
export declare function createSegment(value: string): (DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Left<"create-segment-path-error", string>);
