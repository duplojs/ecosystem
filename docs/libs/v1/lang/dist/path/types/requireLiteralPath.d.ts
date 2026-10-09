import { IsLiteralPath } from './isLiteralPath';
import type * as DCommon from '../../common';
export type RequireLiteralPath<GenericValue extends string> = IsLiteralPath<GenericValue> extends true ? unknown : DCommon.ComputedTypeError<"Value is not a path.">;
