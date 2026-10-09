import { Segment } from './constraints';
import * as DKind from '../kind';
declare const CreateSegmentPathError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangPath/create-segment-path-error", unknown>>, ErrorConstructor>;
export declare class CreateSegmentPathError extends CreateSegmentPathError_base {
    value: string;
    constructor(value: string);
}
export declare function createSegmentOrThrow(value: string): string & Segment;
export {};
