import { IsLiteralAbsolutePath } from './isLiteralAbsolutePath';
import type * as DCommon from '../../common';
export type RequireLiteralAbsolutePath<GenericValue extends string> = IsLiteralAbsolutePath<GenericValue> extends true ? unknown : DCommon.ComputedTypeError<"Value is not a absolute path.">;
