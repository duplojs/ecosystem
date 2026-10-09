import { IsLiteral } from './isLiteral';
import type * as DCommon from '../../common';
import type * as DString from '../../string';
export type IsInteger<GenericValue extends number> = DCommon.And<[
    IsLiteral<GenericValue>,
    DCommon.Not<DString.Includes<`${GenericValue}`, ".">>
]>;
