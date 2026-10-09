import { IsPositive } from './isPositive';
import type * as DString from '../../string';
export type Absolute<GenericValue extends number> = IsPositive<GenericValue> extends true ? GenericValue : DString.Shift<`${GenericValue}`> extends `${infer InferredResult extends number}` ? InferredResult : never;
