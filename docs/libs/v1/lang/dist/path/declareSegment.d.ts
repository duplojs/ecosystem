import { Path, Segment } from './constraints';
import { RequireLiteralSegmentPath } from './types';
export declare function declareSegment<const GenericValue extends string>(value: (GenericValue & RequireLiteralSegmentPath<GenericValue>)): GenericValue & Segment & Path;
