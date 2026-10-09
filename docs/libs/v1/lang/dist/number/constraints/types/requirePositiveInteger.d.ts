import { IsPositiveInteger } from './isPositiveInteger';
import type * as DCommon from '../../../common';
export type RequirePositiveInteger<GenericNumber extends number> = IsPositiveInteger<GenericNumber> extends true ? unknown : DCommon.ComputedTypeError<"Only positive integer number is allowed.">;
