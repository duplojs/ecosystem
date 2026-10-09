import { IsNegative } from './isNegative';
import type * as DCommon from '../../common';
export type IsPositive<GenericValue extends number> = DCommon.Not<IsNegative<GenericValue>>;
