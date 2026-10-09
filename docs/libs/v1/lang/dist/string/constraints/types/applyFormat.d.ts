import { Format } from '../format';
import type * as DCommon from '../../../common';
export type ApplyFormat<GenericValue extends string> = GenericValue extends Format<string, infer InferredValue> ? (GenericValue & DCommon.UnionToIntersection<InferredValue>) : GenericValue;
