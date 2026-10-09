import type * as DArray from '../../array';
import type * as DCommon from '../../common';
export type RequireSegments<GenericSegments extends readonly string[]> = DArray.HasAtLeastElements<GenericSegments, 1> extends true ? unknown : DCommon.ComputedTypeError<"Path segments must have at least 1 element.">;
