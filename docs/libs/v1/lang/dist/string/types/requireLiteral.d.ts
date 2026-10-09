import { IsLiteral } from './isLiteral';
import type * as DCommon from '../../common';
export type RequireLiteral<GenericString extends string> = IsLiteral<GenericString> extends true ? unknown : DCommon.ComputedTypeError<"Expected value must be a string literal">;
