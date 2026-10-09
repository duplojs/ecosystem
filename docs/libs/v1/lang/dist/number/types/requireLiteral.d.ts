import { IsLiteral } from './isLiteral';
import type * as DCommon from '../../common';
export type RequireLiteral<GenericNumber extends number> = IsLiteral<GenericNumber> extends true ? unknown : DCommon.ComputedTypeError<"Must be a literal number, not the generic 'number'">;
