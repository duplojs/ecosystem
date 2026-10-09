import { ExcludeEqual } from './excludeEqual';
import { IsNever } from './isNever';
import { LastUnionElement } from './lastUnionElement';
type Remove<GenericValue extends unknown, GenericLast extends GenericValue> = (GenericLast | RemoveDuplicateInUnion<ExcludeEqual<GenericValue, GenericLast>>);
export type RemoveDuplicateInUnion<GenericValue extends unknown> = IsNever<GenericValue> extends true ? never : Remove<GenericValue, LastUnionElement<GenericValue>>;
export {};
