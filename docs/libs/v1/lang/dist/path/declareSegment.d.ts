import { Segment } from './constraints';
import { RequireLiteralSegmentPath } from './types';
export declare function declareSegment<GenericValue extends string>(value: (GenericValue & RequireLiteralSegmentPath<GenericValue>)): GenericValue & Segment;
