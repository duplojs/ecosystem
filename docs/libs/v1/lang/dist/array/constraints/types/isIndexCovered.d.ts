import { ExtractLengthEqual, LengthEqual } from '../lengthEqual';
import { ExtractMinElements, MinElements } from '../minElements';
import type * as DCommon from '../../../common';
import type * as DNumber from '../../../number';
export type IsIndexCovered<GenericArray extends readonly unknown[], GenericIndex extends number> = DCommon.IsEqual<GenericIndex, number> extends true ? false : ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength> ? DNumber.IsGreater<InferredLength, GenericIndex> : ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin> ? DNumber.IsGreater<InferredMin, GenericIndex> : false;
