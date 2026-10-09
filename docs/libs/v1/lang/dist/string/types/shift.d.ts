import { IsKeyPattern } from './isKeyPattern';
import type * as DCommon from '../../common';
export type Shift<GenericValue extends string> = IsKeyPattern<GenericValue> extends true ? string : DCommon.IsEqual<GenericValue, ""> extends true ? "" : GenericValue extends `${infer _InferredFirst}${infer InferredRest}` ? InferredRest : string;
