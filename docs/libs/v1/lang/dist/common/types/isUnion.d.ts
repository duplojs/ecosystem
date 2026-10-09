import { IsEqual } from './isEqual';
import { LastUnionElement } from './lastUnionElement';
import { Not } from './not';
export type IsUnion<GenericValue extends unknown> = IsEqual<GenericValue, never> extends true ? false : Not<IsEqual<GenericValue, LastUnionElement<GenericValue>>>;
