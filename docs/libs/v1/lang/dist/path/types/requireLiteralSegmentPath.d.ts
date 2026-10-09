import { IsLiteralSegmentPath } from './isLiteralSegmentPath';
import type * as DCommon from '../../common';
export type RequireLiteralSegmentPath<GenericValue extends string> = IsLiteralSegmentPath<GenericValue> extends true ? unknown : DCommon.ComputedTypeError<"Value is not a segment path.">;
