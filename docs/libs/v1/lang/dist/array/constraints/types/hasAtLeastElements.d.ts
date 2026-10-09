import { ExtractMinElements, MinElements } from '../minElements';
import { ExtractLengthEqual, LengthEqual } from '../lengthEqual';
import type * as DCommon from '../../../common';
import type * as DNumber from '../../../number';
export type HasAtLeastElements<GenericArray extends readonly unknown[], GenericMin extends number> = DCommon.IsEqual<GenericMin, number> extends true ? false : ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength> ? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> : ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin> ? DNumber.IsGreaterOrEqual<InferredMin, GenericMin> : false;
