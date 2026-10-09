import { ExtractMaxElements, MaxElements } from '../maxElements';
import { ExtractLengthEqual, LengthEqual } from '../lengthEqual';
import type * as DCommon from '../../../common';
import type * as DNumber from '../../../number';
export type HasAtMostElements<GenericArray extends readonly unknown[], GenericMax extends number> = DCommon.IsEqual<GenericMax, number> extends true ? false : ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength> ? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> : ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax> ? DNumber.IsGreaterOrEqual<GenericMax, InferredMax> : false;
