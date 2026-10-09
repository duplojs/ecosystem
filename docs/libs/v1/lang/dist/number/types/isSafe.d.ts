import { IsLiteral } from './isLiteral';
import { MaxSafeNumber, MinSafeNumber } from '../constraints';
import { IsGreaterOrEqual } from './isGreater';
import { IsLessOrEqual } from './isLess';
import type * as DCommon from '../../common';
export type IsSafe<GenericInput extends number> = DCommon.And<[
    IsLiteral<GenericInput>,
    IsGreaterOrEqual<GenericInput, MinSafeNumber>,
    IsLessOrEqual<GenericInput, MaxSafeNumber>
]>;
