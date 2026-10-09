import { Segment } from './constraints';
import { IsLiteralSegmentPath } from './types';
import type * as DString from '../string';
export declare function isSegment<GenericValue extends string>(value: GenericValue): value is (GenericValue extends Segment ? GenericValue : IsLiteralSegmentPath<GenericValue> extends true ? GenericValue : DString.IsLiteral<GenericValue> extends true ? never : GenericValue & Segment);
