import { IsNegative } from './isNegative';
import type * as DCommon from '../../common';
export type ForbiddenNegative<GenericNumber extends number> = IsNegative<GenericNumber> extends true ? DCommon.ComputedTypeError<"Only positive number is allowed."> : GenericNumber;
