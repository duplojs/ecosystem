import { ComputedTypeError } from './computedTypeError';
import { IsUnion } from './isUnion';
export type ForbiddenUnion<GenericValue extends unknown> = IsUnion<GenericValue> extends true ? ComputedTypeError<"Union value is forbidden."> : unknown;
