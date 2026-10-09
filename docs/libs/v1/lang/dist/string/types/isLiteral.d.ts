import { IsKeyPattern } from './isKeyPattern';
import type * as DCommon from '../../common';
export type IsLiteral<GenericString extends string> = string extends GenericString ? false : DCommon.IsNever<GenericString> extends true ? false : DCommon.Not<IsKeyPattern<Extract<DCommon.RemoveConstraint<GenericString>, string>>>;
