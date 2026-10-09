import { Segment } from './constraints';
import * as DCommon from '../common';
declare const CreateSegmentPathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-segment-path-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-segment-path-error", unknown>>, unknown>;
export declare class CreateSegmentPathError extends CreateSegmentPathError_base {
    value: string;
    constructor(value: string);
}
export declare function createSegmentOrThrow(value: string): string & Segment;
export {};
