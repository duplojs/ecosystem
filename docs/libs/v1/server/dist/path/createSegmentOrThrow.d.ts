import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
declare const CreateSegmentPathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-segment-path-error", string> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-segment-path-error", unknown>>, unknown>;
export declare class CreateSegmentPathError extends CreateSegmentPathError_base {
    value: string;
    constructor(value: string);
}
export declare function createSegmentOrThrow(value: string): string & DPath.Segment & DPath.Path;
export {};
