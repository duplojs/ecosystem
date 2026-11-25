import { Segment } from './constraints';
export declare function concatSegment(newPart: string & Segment): (base: string & Segment) => string & Segment;
export declare function concatSegment(base: string & Segment, newPart: string & Segment, ...newParts: (string & Segment)[]): string & Segment;
